import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import LeftSidebar from "../components/LeftSideBar";
import Header from "../components/Header";

const BASE_URL = import.meta.env.VITE_API_URL;

const WorkAssign = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    userId: "",
    moduleId: "",
    workType: "",
    startDatetime: "",
    endDatetime: "",
    priority: "",
    status: "Pending",
    expectedCompletionDate: "",
    remarks: "",
    referencePhoto: "",
  });

  const [employees, setEmployees] = useState([]);
  const [modules, setModules] = useState([]);
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token"); // Get token from localStorage

  // Fetch Employees on Mount
  useEffect(() => {
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    fetch(`${BASE_URL}api/employees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token in the request
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data); // Ensure `data` is an array before setting state
        } else {
          throw new Error(
            "Unexpected API response: Employees data is not an array"
          );
        }
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, [token]);

  // Fetch Modules on Mount
  useEffect(() => {
    let isMounted = true;
    fetch(`${BASE_URL}api/modules`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token in the request
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setModules(data);
      })
      .catch((err) => console.error("Error fetching modules:", err));

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure IDs are numbers
    const payload = {
      ...formData,
      employee_id: Number(formData.userId),
      module_id: Number(formData.moduleId),
    };

    console.log("Submitting Data:", payload);

    try {
      const res = await fetch(`${BASE_URL}api/workassign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to assign work: ${JSON.stringify(errorData)}`);
      }

      alert("✅ Work assigned successfully!");

      console.log("Work assigned successfully!");
    } catch (err) {
      console.error("Error assigning work:", err);
    }
  };

  return (
    <div className="relative">
    {/* Add the sidebar component */}
    <Header/>
    <LeftSidebar />
    <div
      className="p-4 pt-46 py-4 h-screen overflow-auto flex flex-col items-center justify-center"
      style={{ background: "var(--background-gradient)" }}
    >


      {/* Work Assignment Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 mt-46  text-[var(--text-color)]  space-y-4 sm:mx-12"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Assign Work</h2>

        {/* Select Employee */}
        <label htmlFor="userId">Select Employee</label>
        <select
          id="userId"
          name="userId"
          onChange={handleChange}
          value={formData.userId}
          className="input-style"
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.userId} value={emp.userId}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        {/* Select Module */}
        <label htmlFor="moduleId">Select Module</label>
        <select
          id="moduleId"
          name="moduleId"
          onChange={handleChange}
          value={formData.moduleId}
          className="input-style"
          required
        >
          <option value="">Select Module</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.moduleName}
            </option>
          ))}
        </select>

        {/* Work Type */}
        <label htmlFor="workType">Select Work Type</label>
        <select
          id="workType"
          name="workType"
          onChange={handleChange}
          value={formData.workType}
          className="input-style"
          required
        >
          <option value="">Select Work Type</option>
          <option value="Support">Support</option>
          <option value="New Module">New Module</option>
          <option value="Existing Issues">Existing Issues</option>
        </select>

        {/* Start Date */}
        <label htmlFor="startDatetime">Start Date & Time</label>
        <input
          id="startDatetime"
          type="datetime-local"
          name="startDatetime"
          onChange={handleChange}
          value={formData.startDatetime}
          className="input-style"
          required
        />

        {/* End Date */}
        <label htmlFor="endDatetime">End Date & Time</label>
        <input
          id="endDatetime"
          type="datetime-local"
          name="endDatetime"
          onChange={handleChange}
          value={formData.endDatetime}
          className="input-style"
          required
        />

        {/* Priority */}
        <label htmlFor="priority">Select Priority</label>
        <select
          id="priority"
          name="priority"
          onChange={handleChange}
          value={formData.priority}
          className="input-style"
          required
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Expected Completion Date */}
        <label htmlFor="expectedCompletionDate">Expected Completion Date</label>
        <input
          id="expectedCompletionDate"
          type="datetime-local"
          name="expectedCompletionDate"
          onChange={handleChange}
          value={formData.expectedCompletionDate}
          className="input-style"
          required
        />

        {/* Status Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="status">Select Status</label>
          <select
            id="status"
            name="status"
            onChange={handleChange}
            value={formData.status}
            className="input-style"
            required
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        {/* Remarks */}
        <label htmlFor="remarks">Remarks</label>
        <textarea
          id="remarks"
          name="remarks"
          placeholder="Remarks"
          onChange={handleChange}
          value={formData.remarks}
          className="input-style"
        ></textarea>

        {/* Reference Photo URL */}
        <label htmlFor="referencePhoto">Reference Photo URL</label>
        <input
          id="referencePhoto"
          type="text"
          name="referencePhoto"
          placeholder="Reference Photo URL"
          onChange={handleChange}
          value={formData.referencePhoto}
          className="input-style"
        />

        {/* Submit Button */}
        <button type="submit" className="btn-primary w-full">
          Assign Work
        </button>
      </form>
    </div>
    </div>
  );
};

export default WorkAssign;
