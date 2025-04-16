import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme"; // Custom hook for theme management

const DashboardCard = ({ title, route }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="group cursor-pointer bg-[var(--button-bg)]/90 text-[var(--button-text)] text-lg font-semibold px-6 py-8 rounded-2xl shadow-2xl transition-transform  duration-300 ease-in-out hover:bg-[var(--button-bg-hover)] hover:scale-[1.03] active:scale-[0.98] backdrop-blur-md ring-1 ring-[var(--text-color)]/20 "
    >
      <div className="text-center tracking-wide group-hover:tracking-wider transition-all duration-300 ease-in-out">
        {title}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [workAssignments, setWorkAssignments] = useState([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const { theme, toggleTheme } = useTheme(); // Using the custom hook

  const token = localStorage.getItem("token");

  const getUserIdFromToken = () => {
    // Implement actual token decoding logic here
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const fetchUser = async () => {
    try {
      let id = getUserIdFromToken();
      const response = await fetch(`http://localhost:5000/api/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsername(data.username);
      console.log(username);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchWorkAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/workassign", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add this line
        },
      });
      const data = await res.json();
      setWorkAssignments(data);
    } catch (err) {
      console.error("Error fetching work assignments:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects`);

      if (!res.ok) {
        // If API returns 404 or any error, we assume no projects
        setProjects([]);
        return;
      }

      const data = await res.json();

      // Make sure it's an array before setting it
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    }
  };

  // ✅ Proper useEffect
  useEffect(() => {
    if (token) {
      fetchUser();
      fetchEmployees();
      fetchWorkAssignments();
      fetchProjects();
    } else {
      console.warn("No token found. Redirecting to login.");
      navigate("/login"); // optional: useNavigate
    }
  }, []);

  return (
    <div
      className="min-h-screen p-8 transition-all duration-300 text-[var(--text-color)]"
      style={{ background: "var(--background-gradient)" }}
    >
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-[var(--theme-bg)] hover:bg-opacity-80 transition active:scale-95 text-white"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <h1 className="text-4xl font-bold mb-6 text-center text-[var(--text-color)]">
        Hello {username} !!!
      </h1>

      {/* Employee List */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Employees</h2>
        <div className="overflow-x-auto backdrop-blur-lg bg-[var(--form-bg)]/60 shadow-xl rounded-2xl ring-1 ring-[var(--text-color)]/20 text-zinc-800 max-w-2xl mx-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {emp.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dashboard Feature Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <DashboardCard title="Create Employee" route="/employee-creation" />
          <DashboardCard title="Create Client" route="/client" />
          <DashboardCard title="Create Project" route="/project-creation" />
          <DashboardCard title="Create Module" route="/module-creation" />
          <DashboardCard title="Assign Work" route="/workAssign" />
        </div>
      </section>

      {/* Work Assignments */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Work Assignments</h2>
        <div className="overflow-x-auto backdrop-blur-lg bg-[var(--form-bg)]/60 shadow-xl rounded-2xl ring-1 ring-[var(--text-color)]/20 text-zinc-800">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Completion
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {workAssignments.map((wa) => {
                const employee = employees.find(
                  (emp) => emp.userId === wa.userId
                );

                return (
                  <tr key={wa.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee ? employee.username : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {wa.Module?.Project?.projectName || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {wa.Module?.moduleName || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {wa.priority || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {wa.workType || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {wa.status || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {wa.expected_completion_date
                        ? new Date(
                            wa.expected_completion_date
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
