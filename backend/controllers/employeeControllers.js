import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

//add employees
export const addEmployee = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const { username, password, email, role = "Employee", ...employeeData } = req.body;
    const finalRole = role && role.trim() !== "" ? role : "Employee";

    if (!username || !password || !finalRole) {
      return res.status(400).json({ message: "Missing required user details" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Step 1: Create the User
    const user = await User.create({ username, password, role: finalRole });

    // ✅ Step 2: Create the Employee and link the User
    const employee = await Employee.create({
      ...employeeData,
      username,
      email,
      role: finalRole,
      userId: user.id // 👈 This is the important part
    });

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({ message: "Failed to add employee", error: error.message });
  }
};


//fetch all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll(); // Fetch all employees from DB
    res.status(200).json(employees);
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees", error: error.message });
  }
};

