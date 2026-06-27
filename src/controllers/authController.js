import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import { ROLES } from "../config/constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const exists = await User.findOne({ email: cleanEmail });
  if (exists) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  const safeRole = Object.values(ROLES).includes(role) ? role : ROLES.SEEKER;

  const user = await User.create({
    name: String(name).trim(),
    email: cleanEmail,
    password,
    role: safeRole,
  });

  return res.status(201).json({
    message: "Registration successful",
    token: generateToken(user._id),
    user: user.toSafeJSON(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  const user = await User.findOne({
    email: String(email).toLowerCase().trim(),
  });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({
    message: "Login successful",
    token: generateToken(user._id),
    user: user.toSafeJSON(),
  });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, skills } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (typeof name === "string" && name.trim()) user.name = name.trim();
  if (Array.isArray(skills)) {
    user.skills = skills.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof skills === "string") {
    user.skills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  await user.save();
  return res.json({ message: "Profile updated", user: user.toSafeJSON() });
});
