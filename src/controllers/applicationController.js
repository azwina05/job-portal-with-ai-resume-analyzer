import path from "path";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import {
  analyzeWithGemini,
  extractResumeText,
} from "../utils/aiResumeAnalyzer.js";
import { ROLES, APPLICATION_STATUS } from "../config/constants.js";
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

export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { skills, resumeText: pastedText } = req.body;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  const existing = await Application.findOne({
    jobId: job._id,
    seekerId: req.user._id,
  });
  if (existing) {
    return res
      .status(400)
      .json({ message: "You have already applied for this job." });
  }

  let resumeFile = "";
  let resumeOriginalName = "";
  let extractedText = "";

  if (req.file) {
    resumeFile = req.file.filename;
    resumeOriginalName = req.file.originalname;
    const filePath = path.join(
      process.env.UPLOAD_DIR || "uploads",
      req.file.filename
    );
    extractedText = await extractResumeText(filePath);
  }

  const resumeText =
    (pastedText && String(pastedText).trim()) || extractedText || "";

  const extraSkills = parseSkills(skills);

  const ai = await analyzeWithGemini({
    resumeText,
    jobTitle: job.title,
    jobDescription: job.description,
    requiredSkills: job.requiredSkills,
    extraSkills,
  });

  const application = await Application.create({
    jobId: job._id,
    seekerId: req.user._id,
    employerId: job.employerId,
    resumeFile,
    resumeOriginalName,
    resumeText,
    extraSkills,
    aiScore: ai.score,
    matchedSkills: ai.matchedSkills,
    missingSkills: ai.missingSkills,
    aiSummary: ai.summary,
    aiRecommendation: ai.recommendation,
    status: APPLICATION_STATUS.PENDING,
  });

  return res
    .status(201)
    .json({ message: "Application submitted", application });
});

export const myApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ seekerId: req.user._id })
    .sort({ createdAt: -1 })
    .populate("jobId")
    .populate("employerId", "name email");
  return res.json({ applications: apps });
});

export const employerApplications = asyncHandler(async (req, res) => {
  const filter = { employerId: req.user._id };
  if (req.query.jobId) filter.jobId = req.query.jobId;
  const apps = await Application.find(filter)
    .sort({ createdAt: -1 })
    .populate("jobId")
    .populate("seekerId", "name email skills");
  return res.json({ applications: apps });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = Object.values(APPLICATION_STATUS);
  if (!allowed.includes(status)) {
    return res
      .status(400)
      .json({ message: `Invalid status. Allowed: ${allowed.join(", ")}` });
  }

  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });

  const isOwner = String(app.employerId) === String(req.user._id);
  const isAdmin = req.user.role === ROLES.ADMIN;
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  app.status = status;
  await app.save();
  return res.json({ message: "Status updated", application: app });
});
