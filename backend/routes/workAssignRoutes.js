import express from "express";
import { assignWork, getWorkAssignments, updateWorkAssignment } from "../controllers/workAssignController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",authenticateToken, assignWork); // ✅ Assign work to an employee
router.get("/",authenticateToken, getWorkAssignments); // ✅ Get all work assignments
router.put("/update/:id",authenticateToken, updateWorkAssignment);


export default router;
