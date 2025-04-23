import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { addClient, deleteClient, getClientById, getClients, updateClient } from "../controllers/clientController.js";

const router = express.Router();

router.get("/",authenticateToken, getClients);
router.post("/",authenticateToken, addClient);
router.get("/:id",authenticateToken, getClientById);
router.put("/:id",authenticateToken, updateClient);
router.delete("/:id",authenticateToken, deleteClient);

export default router;
