import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSideBar";
import useTheme from "../hooks/useTheme"; // Custom hook for theme management

// Add these imports at the top of your file
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Replace the existing imports at the top of your file with:
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE_URL = import.meta.env.VITE_API_URL;

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

// Edit Modal Component
const EditWorkAssignmentModal = ({
  isOpen,
  onClose,
  assignment,
  employees,
  modules,
  onSave,
}) => {
  const [formData, setFormData] = useState({
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

  const token = localStorage.getItem("token");

  // Populate form data when assignment changes
  useEffect(() => {
    if (assignment) {
      setFormData({
        userId: assignment.userId || "",
        moduleId: assignment.module_id || "",
        workType: assignment.workType || "",
        startDatetime: assignment.start_datetime
          ? new Date(assignment.start_datetime).toISOString().slice(0, 16)
          : "",
        endDatetime: assignment.end_datetime
          ? new Date(assignment.end_datetime).toISOString().slice(0, 16)
          : "",
        priority: assignment.priority || "",
        status: assignment.status || "Pending",
        expectedCompletionDate: assignment.expected_completion_date
          ? new Date(assignment.expected_completion_date)
              .toISOString()
              .slice(0, 16)
          : "",
        remarks: assignment.remarks || "",
        referencePhoto: assignment.reference_photo || "",
      });
    }
  }, [assignment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map form data to match backend expectations
    const payload = {
      userId: Number(formData.userId),
      module_id: Number(formData.moduleId),
      workType: formData.workType,
      start_datetime: formData.startDatetime,
      end_datetime: formData.endDatetime,
      expected_completion_date: formData.expectedCompletionDate,
      priority: formData.priority,
      status: formData.status,
      remarks: formData.remarks,
      reference_photo: formData.referencePhoto,
    };

    try {
      const res = await fetch(
        `${BASE_URL}api/workassign/update/${assignment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to update work assignment: ${JSON.stringify(errorData)}`
        );
      }

      alert("✅ Work assignment updated successfully!");
      onSave(); // Refresh the data
      onClose(); // Close modal
    } catch (err) {
      console.error("Error updating work assignment:", err);
      alert("❌ Failed to update work assignment");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-zinc-800">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Work Assignment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Employee */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Employee
              </label>
              <select
                id="userId"
                name="userId"
                onChange={handleChange}
                value={formData.userId}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.userId} value={emp.userId}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Module */}
            <div>
              <label
                htmlFor="moduleId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Module
              </label>
              <select
                id="moduleId"
                name="moduleId"
                onChange={handleChange}
                value={formData.moduleId}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Module</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.moduleName}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Type */}
            <div>
              <label
                htmlFor="workType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Work Type
              </label>
              <select
                id="workType"
                name="workType"
                onChange={handleChange}
                value={formData.workType}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Work Type</option>
                <option value="Support">Support</option>
                <option value="New Module">New Module</option>
                <option value="Existing Issues">Existing Issues</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDatetime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date & Time
              </label>
              <input
                id="startDatetime"
                type="datetime-local"
                name="startDatetime"
                onChange={handleChange}
                value={formData.startDatetime}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDatetime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date & Time
              </label>
              <input
                id="endDatetime"
                type="datetime-local"
                name="endDatetime"
                onChange={handleChange}
                value={formData.endDatetime}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Priority
              </label>
              <select
                id="priority"
                name="priority"
                onChange={handleChange}
                value={formData.priority}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Expected Completion Date */}
            <div>
              <label
                htmlFor="expectedCompletionDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expected Completion Date
              </label>
              <input
                id="expectedCompletionDate"
                type="datetime-local"
                name="expectedCompletionDate"
                onChange={handleChange}
                value={formData.expectedCompletionDate}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Status
              </label>
              <select
                id="status"
                name="status"
                onChange={handleChange}
                value={formData.status}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div>
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                placeholder="Remarks"
                onChange={handleChange}
                value={formData.remarks}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Reference Photo URL */}
            <div>
              <label
                htmlFor="referencePhoto"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reference Photo URL
              </label>
              <input
                id="referencePhoto"
                type="text"
                name="referencePhoto"
                placeholder="Reference Photo URL"
                onChange={handleChange}
                value={formData.referencePhoto}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [workAssignments, setWorkAssignments] = useState([]);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const { theme, toggleTheme } = useTheme();

  // Pagination for work assignments
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Pagination for employees - ADD THESE TWO LINES
  const [employeeCurrentPage, setEmployeeCurrentPage] = useState(1);
  const employeeRowsPerPage = 5;

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const token = localStorage.getItem("token");

  // Work assignments pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = workAssignments.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(workAssignments.length / rowsPerPage);

  // Employee pagination logic - ADD THESE LINES
  const indexOfLastEmployee = employeeCurrentPage * employeeRowsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeeRowsPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalEmployeePages = Math.ceil(employees.length / employeeRowsPerPage);

  const getUserIdFromToken = () => {
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
      const response = await fetch(`${BASE_URL}api/user/${id}`, {
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
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/employees`, {
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
      const res = await fetch(`${BASE_URL}api/workassign`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setWorkAssignments(data);
    } catch (err) {
      console.error("Error fetching work assignments:", err);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/modules`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setProjects([]);
        return;
      }

      const data = await res.json();

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

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchEmployees();
      fetchWorkAssignments();
      fetchProjects();
      fetchModules();
    } else {
      console.warn("No token found. Redirecting to login.");
      navigate("/login");
    }
  }, []);

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleSaveEdit = () => {
    // Refresh the work assignments after successful edit
    fetchWorkAssignments();
  };

  // Download functions
  const downloadExcel = () => {
    // Prepare data for Excel
    const excelData = workAssignments.map((wa) => {
      const employee = employees.find((emp) => emp.userId === wa.userId);
      return {
        Employee: employee ? employee.username : "Unknown",
        Project: wa.Module?.Project?.projectName || "—",
        Module: wa.Module?.moduleName || "—",
        Priority: wa.priority || "—",
        "Work Type": wa.workType || "—",
        Status: wa.status || "—",
        "Expected Completion": wa.expected_completion_date
          ? new Date(wa.expected_completion_date).toLocaleDateString()
          : "—",
        "Start Date": wa.start_datetime
          ? new Date(wa.start_datetime).toLocaleDateString()
          : "—",
        "End Date": wa.end_datetime
          ? new Date(wa.end_datetime).toLocaleDateString()
          : "—",
        Remarks: wa.remarks || "—",
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Work Assignments");

    // Download file
    XLSX.writeFile(
      workbook,
      `work_assignments_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // Then replace your downloadPDF function with this corrected version:
  const downloadPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Work Assignments Report", 20, 20);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Prepare data for PDF table
    const pdfData = workAssignments.map((wa) => {
      const employee = employees.find((emp) => emp.userId === wa.userId);
      return [
        employee ? employee.username : "Unknown",
        wa.Module?.Project?.projectName || "—",
        wa.Module?.moduleName || "—",
        wa.priority || "—",
        wa.workType || "—",
        wa.status || "—",
        wa.expected_completion_date
          ? new Date(wa.expected_completion_date).toLocaleDateString()
          : "—",
      ];
    });

    // Create table using autoTable (not doc.autoTable)
    autoTable(doc, {
      head: [
        [
          "Employee",
          "Project",
          "Module",
          "Priority",
          "Work Type",
          "Status",
          "Expected Completion",
        ],
      ],
      body: pdfData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Download PDF
    doc.save(`work_assignments_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="relative">
      <Header />
      <div
        className="min-h-screen pt-20 p-8 transition-all duration-300 text-[var(--text-color)]"
        style={{ background: "var(--background-gradient)" }}
      >
        <LeftSidebar />

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
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* CHANGE THIS: Use currentEmployees instead of employees */}
                {currentEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {emp.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADD THIS: Employee Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() =>
                setEmployeeCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={employeeCurrentPage === 1}
              className="px-4 py-2 bg-[var(--button-bg)] text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalEmployeePages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setEmployeeCurrentPage(index + 1)}
                className={`px-3 py-2 rounded ${
                  employeeCurrentPage === index + 1
                    ? "bg-[var(--button-bg-hover)] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setEmployeeCurrentPage((prev) =>
                  Math.min(prev + 1, totalEmployeePages)
                )
              }
              disabled={employeeCurrentPage === totalEmployeePages}
              className="px-4 py-2 bg-[var(--button-bg)] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Work Assignments</h2>
            <div className="flex gap-3">
              {/* Add New Work Assignment */}
              <button
                onClick={() => navigate("/workAssign")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
              >
                <span className="text-xl">+</span>
                <span>New Assignment</span>
              </button>

              {/* Download as Excel */}
              <button
                onClick={() => downloadExcel()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
              >
                <span>📊</span>
                <span>Download Excel</span>
              </button>

              {/* Download as PDF */}
              <button
                onClick={() => downloadPDF()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
              >
                <span>📄</span>
                <span>Download PDF</span>
              </button>
            </div>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edit
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentRows.map((wa) => {
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(wa)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Work Assignments Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[var(--button-bg)] text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-[var(--button-bg-hover)] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[var(--button-bg)] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>

        {/* Edit Modal */}
        <EditWorkAssignmentModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          assignment={selectedAssignment}
          employees={employees}
          modules={modules}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
