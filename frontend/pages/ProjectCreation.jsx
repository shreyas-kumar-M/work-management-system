import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import LeftSidebar from "../components/LeftSideBar";
import Header from "../components/Header";


const BASE_URL = import.meta.env.VITE_API_URL;

const ProjectCreation = () => {
  const [formData, setFormData] = useState({
    client_id: "",
    projectName: "",
  });

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { theme, toggleTheme } = useTheme(); // Using the custom hook

  const token = localStorage.getItem("token");

  // Fetch clients & projects together
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          fetch(`${BASE_URL}api/clients`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${BASE_URL}api/projects`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const clientsData = await clientsRes.json();
        const projectsData = await projectsRes.json();

        setClients(clientsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Data loaded
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending Project Data:", formData);
      const res = await fetch(`${BASE_URL}api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      const data = await res.json();
      setProjects([...projects, data]);

 
  
      alert("✅ Project created successfully!");
      
      setFormData({ client_id: "", projectName: "" });
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  return (
    <div className="relative">
    {/* Add the sidebar component */}
    <Header/>
    <LeftSidebar />

    <div
      className="p-6 pt-20 h-screen overflow-auto"
      style={{ background: "var(--background-gradient)" }}
    >

      <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4 text-center">
        Project Management
      </h2>

      {/* Show Loading if data is still fetching */}
      {loading ? (
        <p className="text-center text-[var(--text-color)]">Loading...</p>
      ) : (
        <>
          {/* Project Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 backdrop-blur-2xl rounded-lg text-[var(--text-color)] bg-[var(--form-bg)] ring-inset ring-1 ring-[var(--text-color)]/20 shadow-md space-y-4 sm:mx-12"
          >
            <label className="block font-medium">Client Name</label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="input-style"
              required
            >
              <option value="">Select a Client</option>
              {clients.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.clientName}
                </option>
              ))}
            </select>

            <label className="block font-medium">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="input-style"
              placeholder="Enter project name"
              required
            />

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!formData.client_id || !formData.projectName} // ✅ Corrected condition
            >
              Add Project
            </button>
          </form>

          {/* Project List */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-[var(--text-color)] mb-2">
              Existing Projects
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Client Name</th>
                  <th className="border p-2">Project Name</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <tr key={index} className="text-center bg-gray-100">
                      <td className="border p-2">
                        {clients.find((c) => c.client_id === project.client_id)
                          ?.clientName || "Unknown"}
                      </td>

                      <td className="border p-2">{project.projectName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="border p-2 text-center">
                      No projects available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default ProjectCreation;
