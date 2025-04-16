import express from "express";
import { assignWork, getWorkAssignments, updateWorkStatus, updateWorkAssignment } from "../controllers/workAssignController.js";

const router = express.Router();

router.post("/", assignWork); // ✅ Assign work to an employee
router.get("/", getWorkAssignments); // ✅ Get all work assignments
// router.put("/:id/status", updateWorkStatus); // ✅ Update work status
router.put("/update/:id", updateWorkAssignment);

export default router;
