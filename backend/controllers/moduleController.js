import Module from "../models/Module.js";
import Project from "../models/Project.js";

// Get all modules
export const getModules = async (req, res) => {
    try {
        const modules = await Module.findAll({
            include: {
                model: Project,
                attributes: ["projectName"],
            },
        });
        res.json(modules);
    } catch (err) {
        res.status(500).json({ message: "Error fetching modules", error: err.message });
    }
};

// Add a new module
export const addModule = async (req, res) => {
    try {
        const { project_id, moduleName } = req.body;

        const project = await Project.findByPk(project_id);
        if (!project) return res.status(400).json({ message: "Invalid Project ID" });

        const newModule = await Module.create({ project_id, moduleName });

        res.status(201).json(newModule);
    } catch (err) {
        res.status(500).json({ message: "Error adding module", error: err.message });
    }
};

// Get modules by project ID
export const getModulesByProjectId = async (req, res) => {
    try {
        const modules = await Module.findAll({
            where: { project_id: req.params.projectId },
        });
        res.json(modules);
    } catch (err) {
        res.status(500).json({ message: "Error fetching modules", error: err.message });
    }
};
