import express from "express";
import { addEmployee, getAllEmployees } from "../controllers/employeeControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add_employee",authenticateToken, addEmployee);
router.get("/",authenticateToken, getAllEmployees);

export default router;
