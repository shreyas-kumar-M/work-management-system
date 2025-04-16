import Client from "../models/Client.js";

// Get all clients
export const getClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: "Error fetching clients", error: err.message });
    }
};

// Add a new client
export const addClient = async (req, res) => {
    try {
        const { clientName, branchName, contactNumber, email, contactPerson } = req.body;
        const client = await Client.create({ clientName, branchName, contactNumber, email, contactPerson });
        res.status(201).json(client);
    } catch (err) {
        res.status(500).json({ message: "Error adding client", error: err.message });
    }
};

// Get a single client by ID
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: "Client not found" });
        res.json(client);
    } catch (err) {
        res.status(500).json({ message: "Error fetching client", error: err.message });
    }
};

// Update a client
export const updateClient = async (req, res) => {
    try {
        const { clientName, branchName, contactNumber, email, contactPerson } = req.body;
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        await client.update({ clientName, branchName, contactNumber, email, contactPerson });
        res.json(client);
    } catch (err) {
        res.status(500).json({ message: "Error updating client", error: err.message });
    }
};

// Delete a client
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        await client.destroy();
        res.json({ message: "Client deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting client", error: err.message });
    }
};
