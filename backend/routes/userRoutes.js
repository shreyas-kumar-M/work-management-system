import express from "express";
import { getUserByUserId } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id",authenticateToken, getUserByUserId);

export default router;