import express from "express";
import { addModule, getModules, getModulesByProjectId } from "../controllers/moduleController.js";

const router = express.Router();

router.get("/", getModules); // Get all modules
router.post("/", addModule); // Add a new module
router.get("/:projectId", getModulesByProjectId); // Get modules by project ID

export default router;
