import express from "express";
import { getProjects, addProject, getProjectsByClient } from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);   // Get all projects
router.post("/", addProject);   // Add a new project
router.get("/client/:clientId", getProjectsByClient); // ✅ Get projects for a specific client

export default router;
