import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { addModule, getModules, getModulesByProjectId } from "../controllers/moduleController.js";

const router = express.Router();

router.get("/",authenticateToken, getModules); // Get all modules
router.post("/",authenticateToken, addModule); // Add a new module
router.get("/:projectId",authenticateToken, getModulesByProjectId); // Get modules by project ID

export default router;
