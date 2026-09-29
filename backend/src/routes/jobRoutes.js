import express from "express";
import {
  createJob,
  listJobs,
  listEmployerJobs,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { ROLES } from "../config/constants.js";

const router = express.Router();

router.get("/", listJobs);
router.get("/employer", protect, authorize(ROLES.EMPLOYER, ROLES.ADMIN), listEmployerJobs);
router.get("/:id", getJob);

router.post("/", protect, authorize(ROLES.EMPLOYER, ROLES.ADMIN), createJob);
router.put("/:id", protect, authorize(ROLES.EMPLOYER, ROLES.ADMIN), updateJob);
router.delete("/:id", protect, authorize(ROLES.EMPLOYER, ROLES.ADMIN), deleteJob);

export default router;
