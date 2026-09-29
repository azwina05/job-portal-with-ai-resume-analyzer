import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    location: { type: String, default: "Remote", trim: true },
    salary: { type: String, default: "", trim: true },
    requiredSkills: { type: [String], default: [] },
    description: { type: String, required: true },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
