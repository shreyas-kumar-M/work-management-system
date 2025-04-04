import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";

const WorkAssign = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
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

  // Fetch Employees on Mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      console.error("No authentication token found!");
      return;
    }
  
    fetch("http://localhost:5000/api/employees", {
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
          throw new Error("Unexpected API response: Employees data is not an array");
        }
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);
  
  // Fetch Modules on Mount
  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:5000/api/modules")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setModules(data);
      })
      .catch((err) => console.error("Error fetching modules:", err));

    return () => {
      isMounted = false;
    };
  }, []);

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
      employee_id: Number(formData.employeeId), 
      module_id: Number(formData.moduleId),
    };
  
    console.log("Submitting Data:", payload); // 🛠 Debugging step
  
    try {
      const res = await fetch("http://localhost:5000/api/workassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to assign work: ${JSON.stringify(errorData)}`);
      }
  
      console.log("Work assigned successfully!");
    } catch (err) {
      console.error("Error assigning work:", err);
    }
  };
   
  
  return (
    <div
      className="p-4 py-4 h-screen overflow-auto flex flex-col items-center justify-center pt-16"
      style={{ background: "var(--background-gradient)" }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute text-white top-4 right-4 p-2 rounded-full bg-[var(--theme-bg)] hover:bg-opacity-80 transition-[transform,background-color] active:scale-95 z-10"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Work Assignment Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 mt-86 backdrop-blur-2xl rounded-lg text-[var(--text-color)] bg-[var(--form-bg)] ring-inset ring-1 ring-[var(--text-color)]/20 shadow-md space-y-4 sm:mx-12"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Assign Work</h2>

       {/* Select Employee */}
<label htmlFor="employeeId">Select Employee</label>
<select
  id="employeeId"
  name="employeeId"
  onChange={handleChange}
  value={formData.employeeId}
  className="input-style"
  required
>
  <option value="">Select Employee</option>
  {employees.map((emp) => (
    <option key={emp.id} value={emp.id}>
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
  );
};

export default WorkAssign;
