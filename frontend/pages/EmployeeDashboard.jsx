import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

const EmployeeDashboard = () => {
  const [assignedWork, setAssignedWork] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Step 1: Decode token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const decoded = jwtDecode(token);
    setUser(decoded);

    // Step 2: Fetch assigned work
    const fetchAssignedWork = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/workassign");
        const employeeWorks = res.data.filter(
          (work) => work.employee_id === decoded.id
        );
        setAssignedWork(employeeWorks);
        console.log("Assigned Work:", employeeWorks);
      } catch (err) {
        console.error("Error fetching assigned work:", err);
      }
    };

    fetchAssignedWork();
  }, []);

  if (!user) return <div className="p-6">Loading user data...</div>;

  return (
    <div className="min-h-screen p-6 bg-yellow-100">
      <h1 className="text-3xl font-bold mb-6">
        Welcome {user.username || "Employee"}!
      </h1>

      {assignedWork.length === 0 ? (
        <p>No work assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {assignedWork.map((work, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">
                {work.Module?.moduleName} ({work.workType})
              </h2>
              <p>Status: {work.status}</p>
              <p>Priority: {work.priority}</p>
              <p>Remarks: {work.remarks || "N/A"}</p>
              <p>Expected Completion: {work.expected_completion_date}</p>
              {work.reference_photo && (
                <img
                  src={work.reference_photo}
                  alt="Reference"
                  className="w-48 mt-2"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
