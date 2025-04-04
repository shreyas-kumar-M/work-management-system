import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";

const ModuleCreation = () => {
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    moduleName: "",
  });
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const { theme, toggleTheme } = useTheme();

  // Fetch Clients on Mount
  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:5000/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setClients(data);
      })
      .catch((err) => console.error("Error fetching clients:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!formData.clientId) {
        setProjects([]); // Clear projects when no client is selected
        return;
    }

    let isMounted = true;
    fetch(`http://localhost:5000/api/projects/client/${formData.clientId}`)
        .then((res) => res.json())
        .then((data) => {
            if (isMounted) {
                setProjects(data);
                setFormData((prev) => ({ ...prev, projectId: "" })); // Reset project selection
            }
        })
        .catch((err) => console.error("Error fetching projects:", err));

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
      const res = await fetch("http://localhost:5000/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: formData.projectId,
          moduleName: formData.moduleName,
        }),
      });

      if (!res.ok) throw new Error("Failed to add module");

      setFormData({ clientId: "", projectId: "", moduleName: "" });
    } catch (err) {
      console.error("Error adding module:", err);
    }
  };

  return (
    <div
      className="p-6 h-screen overflow-auto flex flex-col items-center justify-center"
      style={{ background: "var(--background-gradient)" }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute text-white top-4 right-4 p-2 rounded-full bg-[var(--theme-bg)] hover:bg-opacity-80 transition-[transform,background-color] active:scale-95 z-10"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

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
        <select
          name="projectId"
          onChange={handleChange}
          value={formData.projectId}
          className="input-style"
          required
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.projectName}
            </option>
          ))}
        </select>

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
  );
};

export default ModuleCreation;
