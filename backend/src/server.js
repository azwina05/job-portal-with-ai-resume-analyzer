import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((v) => v.trim())
  : "*";

app.use(cors({ origin: corsOrigin, credentials: true }));

// Upload directory
const uploadDir = process.env.UPLOAD_DIR || "uploads";

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ai-job-portal-backend",
  });
});

// Connect to MongoDB before database-dependent API requests
let dbPromise;

const ensureDB = async (_req, _res, next) => {
  try {
    if (!dbPromise) {
      dbPromise = connectDB();
    }

    await dbPromise;
    next();
  } catch (error) {
    dbPromise = null;
    next(error);
  }
};

app.use("/api/auth", ensureDB, authRoutes);
app.use("/api/jobs", ensureDB, jobRoutes);
app.use("/api/applications", ensureDB, applicationRoutes);
app.use("/api/admin", ensureDB, adminRoutes);

app.use(notFound);
app.use(errorHandler);

// Export Express app for Vercel
export default app;

// Local development server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  connectDB()
    .then(() => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`API running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
      process.exit(1);
    });
}