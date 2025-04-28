import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import LeftSidebar from "../components/LeftSideBar";
import Header from "../components/Header";

const BASE_URL = import.meta.env.VITE_API_URL;


const ModuleCreation = () => {
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    moduleName: "",
  });
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");

  // Fetch Clients on Mount
  useEffect(() => {
    let isMounted = true;
    fetch(`${BASE_URL}api/clients`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 Add this
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setClients(data);
      })
      .catch((err) => console.error("Error fetching clients:", err));

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!formData.clientId) {
      setProjects([]);
      return;
    }
  
    let isMounted = true;
  
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/projects/client/${formData.clientId}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 👈 Add this
          }
        });
  
        if (!res.ok) {
          // If API returns 404 or any error, we assume no projects
          setProjects([]);
          return;
        }
  
        const data = await res.json();
  
        if (isMounted) {
          // Make sure it's an array before setting it
          if (Array.isArray(data)) {
            setProjects(data);
          } else {
            setProjects([]);
          }
  
          setFormData((prev) => ({ ...prev, projectId: "" }));
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      }
    };
  
    fetchProjects();
  
    return () => {
      isMounted = false;
    };
  }, [formData.clientId]);
  
  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}api/modules`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,

         },
        body: JSON.stringify({
          project_id: formData.projectId,
          moduleName: formData.moduleName,
        }),
      });

      if (!res.ok) throw new Error("Failed to add module");
      alert("✅ Module added successfully!");
      setFormData({ clientId: "", projectId: "", moduleName: "" });
    } catch (err) {
      console.error("Error adding module:", err);
    }
  };

  return (

    <div className="relative">
    {/* Add the sidebar component */}
    <Header/>
    <div
      className="p-6 h-screen overflow-auto flex flex-col items-center justify-center"
      style={{ background: "var(--background-gradient)" }}
    >

<LeftSidebar />


      {/* Module Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 backdrop-blur-2xl rounded-lg text-[var(--text-color)] bg-[var(--form-bg)] ring-inset ring-1 ring-[var(--text-color)]/20 shadow-md space-y-4 sm:mx-12"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Add Module</h2>

        {/* Select Client */}
        <select
          name="clientId"
          onChange={handleChange}
          value={formData.clientId}
          className="input-style"
          required
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.clientName}
            </option>
          ))}
        </select>

        {/* Select Project */}
        {formData.clientId && projects.length === 0 ? (
          <div className="text-red-500 text-sm italic">
            No projects found for this client.
          </div>
        ) : (
          <select
            name="projectId"
            onChange={handleChange}
            value={formData.projectId}
            className="input-style"
            required
            disabled={!formData.clientId}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        )}

        {/* Module Name Input */}
        <input
          type="text"
          name="moduleName"
          placeholder="Module Name"
          onChange={handleChange}
          value={formData.moduleName}
          className="input-style"
          required
        />

        {/* Submit Button */}
        <button type="submit" className="btn-primary w-full">
          Add Module
        </button>
      </form>
    </div>
    </div>
  );
};

export default ModuleCreation;
