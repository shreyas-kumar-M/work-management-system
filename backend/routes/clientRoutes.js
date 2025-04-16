import express from "express";
import { addClient, deleteClient, getClientById, getClients, updateClient } from "../controllers/clientController.js";

const router = express.Router();

router.get("/", getClients);
router.post("/", addClient);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
