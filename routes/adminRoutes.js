import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { ROLES } from "../config/constants.js";
import {
  stats,
  listUsers,
  listAllJobs,
  listAllApplications,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get("/stats", stats);
router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);
router.get("/jobs", listAllJobs);
router.get("/applications", listAllApplications);

export default router;
