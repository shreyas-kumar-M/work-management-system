import { useState } from "react";
import useTheme from "../hooks/useTheme"; // Custom hook for theme management

const EmployeeForm = () => {
  const { theme, toggleTheme } = useTheme(); // Using the custom hook
  const [message, setMessage] = useState(""); // ✅ To store response message

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    mobileNumber: "",
    email: "",
    permanentAddress: "",
    contactAddress: "",
    username: "",
    password: "",
    joiningDate: "",
    designation: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    console.log("Form Data Before Submission:", formData); // ✅ Log formData

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("❌ Unauthorized: No token found. Please log in.");
            console.error("No token found, user must log in.");
            return;
        }

        const response = await fetch(
            "http://localhost:5000/api/employees/add_employee",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            }
        );

        const result = await response.json();
        console.log("Server Response:", result); // ✅ Log the response

        if (response.ok) {
            setMessage("✅ Employee added successfully!");
            setFormData({
                firstName: "",
                lastName: "",
                gender: "",
                mobileNumber: "",
                email: "",
                permanentAddress: "",
                contactAddress: "",
                username: "",
                password: "",
                joiningDate: "",
                designation: "",
                role: "",
            });
        } else {
            setMessage(`❌ Error: ${result.message}`);
        }
    } catch (error) {
        setMessage("❌ Failed to submit data");
        console.error("Error:", error);
    }

  };
  return (
    <div>
      <div
        className="flex justify-center items-center min-h-screen text-[var(--text-color)]"
        style={{ background: "var(--background-gradient)" }}
      >
        <button
          onClick={toggleTheme}
          className="absolute text-white top-4 right-4 p-2 rounded-full bg-[var(--theme-bg)] hover:bg-opacity-80 transition-[transform,background-color] active:scale-95 z-10"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div className="bg-[var(--form-bg)] backdrop-blur-2xl p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Create Employee
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {/* first name */}
            <div>
              <label className="block">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* last name */}
            <div>
              <label className="block">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Mobile Number */}
            <div>
              <label className="block">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Email */}
            <div>
              <label className="block ">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Permanent Address */}
            <div>
              <label className="block ">Permanent Address</label>
              <input
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Contact Address */}
            <div>
              <label className="block ">Contact Address</label>
              <input
                type="text"
                name="contactAddress"
                value={formData.contactAddress}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Username */}
            <div>
              <label className="block ">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Password */}
            <div>
              <label className="block ">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Joining Date */}
            <div>
              <label className="block ">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Designation */}
            <div>
              <label className="block ">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg bg-[var(--input-bg)]"
                required
              />
            </div>
            {/* Submit Button  */}
            <div className="sm:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--button-text)] p-3 rounded duration-200 transition-[transform,background-color] active:scale-97"
              >
                Create Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
