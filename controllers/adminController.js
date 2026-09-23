import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { ROLES } from "../config/constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const stats = asyncHandler(async (req, res) => {
  const [totalUsers, totalJobs, totalApplications, seekers, employers] =
    await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: ROLES.SEEKER }),
      User.countDocuments({ role: ROLES.EMPLOYER }),
    ]);
  return res.json({
    stats: {
      totalUsers,
      totalJobs,
      totalApplications,
      seekers,
      employers,
    },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json({ users });
});

export const listAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .populate("employerId", "name email");
  return res.json({ jobs });
});

export const listAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .sort({ createdAt: -1 })
    .populate("jobId")
    .populate("seekerId", "name email")
    .populate("employerId", "name email");
  return res.json({ applications });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (String(user._id) === String(req.user._id)) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }
  await user.deleteOne();
  return res.json({ message: "User deleted" });
});
