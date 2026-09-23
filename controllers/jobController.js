import Job from "../models/Job.js";
import { ROLES } from "../config/constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const parseSkills = (val) => {
  if (Array.isArray(val))
    return val.map((s) => String(s).trim()).filter(Boolean);
  if (typeof val === "string")
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    category,
    location,
    salary,
    requiredSkills,
    description,
  } = req.body;

  if (!title || !company || !description) {
    return res
      .status(400)
      .json({ message: "Title, company, and description are required" });
  }

  const job = await Job.create({
    title: String(title).trim(),
    company: String(company).trim(),
    category: String(category || "General").trim(),
    location: String(location || "Remote").trim(),
    salary: String(salary || "").trim(),
    requiredSkills: parseSkills(requiredSkills),
    description: String(description).trim(),
    employerId: req.user._id,
  });

  return res.status(201).json({ message: "Job posted", job });
});

export const listJobs = asyncHandler(async (req, res) => {
  const { q, location, category } = req.query;
  const filter = { isActive: true };

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { requiredSkills: { $regex: q, $options: "i" } },
    ];
  }
  if (location) filter.location = { $regex: location, $options: "i" };
  if (category) filter.category = { $regex: category, $options: "i" };

  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .populate("employerId", "name email");
  return res.json({ jobs });
});

export const listEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employerId: req.user._id }).sort({
    createdAt: -1,
  });
  return res.json({ jobs });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "employerId",
    "name email"
  );
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.json({ job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  const isOwner = String(job.employerId) === String(req.user._id);
  const isAdmin = req.user.role === ROLES.ADMIN;
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const fields = [
    "title",
    "company",
    "category",
    "location",
    "salary",
    "description",
    "isActive",
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined) job[f] = req.body[f];
  }
  if (req.body.requiredSkills !== undefined) {
    job.requiredSkills = parseSkills(req.body.requiredSkills);
  }
  await job.save();
  return res.json({ message: "Job updated", job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  const isOwner = String(job.employerId) === String(req.user._id);
  const isAdmin = req.user.role === ROLES.ADMIN;
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await job.deleteOne();
  return res.json({ message: "Job deleted" });
});
