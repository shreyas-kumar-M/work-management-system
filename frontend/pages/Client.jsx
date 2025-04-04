import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme"; // Custom hook for theme management

const Client = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    branchName: "",
    contactNumber: "",
    email: "",
    contactPerson: "",
  });

  const [clients, setClients] = useState([]);
  const { theme, toggleTheme } = useTheme(); // Using the custom hook

  // Fetch existing clients from API
  useEffect(() => {
    fetch("http://localhost:5000/api/clients") // Correct API URL
    .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Error fetching clients:", err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setClients([...clients, data]); // Update UI with new client
        setFormData({
          clientName: "",
          branchName: "",
          contactNumber: "",
          email: "",
          contactPerson: "",
        });
      })
      .catch((err) => console.error("Error adding client:", err));
  };

  return (
    <div
      className="p-6 h-screen overflow-auto"
      style={{ background: "var(--background-gradient)" }}
    >
      <button
        onClick={toggleTheme}
        className="absolute text-white top-4 right-4 p-2 rounded-full bg-[var(--theme-bg)] hover:bg-opacity-80 transition-[transform,background-color] active:scale-95 z-10"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4 text-center">
        Client Management
      </h2>

      {/* Client Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:mx-12">
        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
          className="input-style"
          required
        />

        <input
          type="text"
          name="branchName"
          placeholder="Branch Name"
          value={formData.branchName}
          onChange={handleChange}
          className="input-style"
          required
        />

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          className="input-style"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-style"
          required
        />

        <input
          type="text"
          name="contactPerson"
          placeholder="Contact Person"
          value={formData.contactPerson}
          onChange={handleChange}
          className="input-style"
          required
        />

        <button type="submit" className="btn-primary w-full">
          Add Client
        </button>
      </form>

      {/* Client List */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-[var(--text-color)] mb-2">
          Existing Clients
        </h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Client Name</th>
              <th className="border p-2">Branch</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Contact Person</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index} className="text-center bg-gray-100">
                <td className="border p-2">{client.clientName}</td>
                <td className="border p-2">{client.branchName}</td>
                <td className="border p-2">{client.contactNumber}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">{client.contactPerson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Client;
