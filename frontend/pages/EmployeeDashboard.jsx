import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme"; // Custom theme hook

const EmployeeDashboard = () => {
  const [assignedWork, setAssignedWork] = useState([]);
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme(); // Theme toggle

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const decoded = jwtDecode(token);
    setUser(decoded);

    const fetchAssignedWork = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/workassign");
        const employeeWorks = res.data.filter(
          (work) => work.userId === decoded.id
        );
        setAssignedWork(employeeWorks);
      } catch (err) {
        console.error("Error fetching assigned work:", err);
      }
    };

    fetchAssignedWork();
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updated = [...assignedWork];
    updated[index][field] = value;
    setAssignedWork(updated);
  };

  const handleUpdate = async (work, index) => {
    const payload = {
      status: work.status,
      remarks: work.remarks,
      reference_photo: work.reference_photo,
    };

    try {
      const res = await axios.put(
        `http://localhost:5000/api/workassign/update/${work.id}`,
        payload
      );

      const updatedWork = res.data.work;
      const updated = [...assignedWork];
      updated[index] = { ...work, updatedAt: updatedWork.updatedAt };
      setAssignedWork(updated);

      alert("✅ Work updated successfully!");
    } catch (err) {
      console.error("Error updating work:", err);
      alert("❌ Error updating work.");
    }
  };

  if (!user)
    return (
      <div className="p-6 text-[var(--text-color)]">Loading user data...</div>
    );

  return (
    <div
      className="min-h-screen p-6 transition-all duration-300 text-[var(--text-color)]"
      style={{ background: "var(--background-gradient)" }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 text-white p-2 rounded-full bg-[var(--theme-bg)] hover:bg-opacity-80 transition-all active:scale-95"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Welcome {user.username || "Employee"}!
      </h1>

      {assignedWork.length === 0 ? (
        <p>No work assigned yet.</p>
      ) : (
        <div className="space-y-6">
          {assignedWork.map((work, index) => (
            <div
              key={work.id}
              className="p-6 rounded-xl shadow-lg backdrop-blur-lg bg-[var(--form-bg)] ring-1 ring-[var(--text-color)]/10 space-y-4"
            >
              <h2 className="text-2xl font-semibold">
                {work.Module?.moduleName} ({work.workType})
              </h2>
              <div className="text-sm">
                <p>📅 Start: {work.start_datetime}</p>
                <p>📅 End: {work.end_datetime}</p>
                <p>⚡ Priority: {work.priority}</p>
                <p>⏳ Expected Completion: {work.expected_completion_date}</p>
                <p>
                  🕒 Last Updated: {new Date(work.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* Editable Fields */}
              <div className="space-y-2">
                <div>
                  <label className="block font-semibold">Status:</label>
                  <select
                    className="border p-2 rounded w-full bg-[var(--input-bg)] text-[var(--input-text)]"
                    value={work.status}
                    onChange={(e) =>
                      handleFieldChange(index, "status", e.target.value)
                    }
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold">Remarks:</label>
                  <textarea
                    className="border p-2 w-full rounded bg-[var(--input-bg)] text-[var(--input-text)]"
                    value={work.remarks || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "remarks", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    Reference Photo URL:
                  </label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded bg-[var(--input-bg)] text-[var(--input-text)]"
                    value={work.reference_photo || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "reference_photo",
                        e.target.value
                      )
                    }
                  />
                  {work.reference_photo && (
                    <img
                      src={work.reference_photo}
                      alt="Reference"
                      className="w-48 mt-2 rounded shadow"
                    />
                  )}
                </div>
              </div>

              <button
                onClick={() => handleUpdate(work, index)}
                className="bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--button-text)] px-4 py-2 rounded transition active:scale-95"
              >
                ✅ Update Work
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
