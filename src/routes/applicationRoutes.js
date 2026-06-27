import express from "express";
import {
  applyToJob,
  myApplications,
  employerApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { ROLES } from "../config/constants.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/apply/:jobId",
  protect,
  authorize(ROLES.SEEKER, ROLES.ADMIN),
  (req, res, next) => {
    uploadResume(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  applyToJob
);

router.get(
  "/my",
  protect,
  authorize(ROLES.SEEKER, ROLES.ADMIN),
  myApplications
);

router.get(
  "/employer",
  protect,
  authorize(ROLES.EMPLOYER, ROLES.ADMIN),
  employerApplications
);

router.put(
  "/:id/status",
  protect,
  authorize(ROLES.EMPLOYER, ROLES.ADMIN),
  updateApplicationStatus
);

export default router;
