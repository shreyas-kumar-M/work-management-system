import Client from "../models/Client.js";
import Project from "../models/Project.js";

// ✅ Get all projects (already includes clientName)
export const getProjects = async (req, res) => {
    try {
      const projects = await Project.findAll({
        include: {
          model: Client,
          attributes: ["clientName"], // ✅ Fetch client name
        },
      });
  
      if (!projects || !Array.isArray(projects)) {
        return res.status(404).json({ error: "No projects found" });
      }
  
      res.json(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);  // ✅ Log error in backend
      res.status(500).json({ error: err.message });
    }
  };
  
// ✅ Add a new project (fetches clientName automatically)
export const addProject = async (req, res) => {
    const { client_id, projectName } = req.body; // Ensure correct field name
  
    try {
        console.log(client_id,projectName);
      const client = await Client.findByPk(client_id);
      if (!client) return res.status(400).json({ message: "Invalid Client ID" });
  
      const newProject = await Project.create({
        projectName,
        client_id, // Use the client's UUID
        clientName: client.clientName, // Ensure the Client model has this field
    });
  
      // Return project with client data
      const projectWithClient = await Project.findByPk(newProject.id, {
        include: [Client]
      });
  
      res.status(201).json(projectWithClient);
    } catch (err) {
        console.error("Error in addProject:", err); // Log full error
        res.status(500).json({ error: err.message });
      }
  };

// ✅ Get projects for a specific client
export const getProjectsByClient = async (req, res) => {
  const { clientId } = req.params;

  try {
      const projects = await Project.findAll({
          where: { client_id: clientId },
          include: {
              model: Client,
              attributes: ["clientName"], // ✅ Fetch client name
          },
      });

      if (!projects.length) {
          return res.status(404).json({ error: "No projects found for this client" });
      }

      res.json(projects);
  } catch (err) {
      console.error("Error fetching projects by client:", err);
      res.status(500).json({ error: err.message });
  }
};
