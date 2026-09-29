import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../config/constants.js";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeFile: { type: String, default: "" },
    resumeOriginalName: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    extraSkills: { type: [String], default: [] },
    aiScore: { type: Number, default: 0 },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    aiSummary: { type: String, default: "" },
    aiRecommendation: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
