import express from "express";
import { addProject, getProjects, getProjectsByClient } from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authenticateToken, getProjects);   // Get all projects
router.post("/",authenticateToken, addProject);   // Add a new project
router.get("/client/:clientId",authenticateToken, getProjectsByClient); // ✅ Get projects for a specific client

export default router;
