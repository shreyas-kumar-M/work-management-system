import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workAssignRoutes from "./routes/workAssignRoutes.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});
//auth
app.use("/api/auth", authRoutes);
//user
app.use("/api/user", userRoutes);
//employee
app.use("/api/employees", employeeRoutes);
//client
app.use("/api/clients", clientRoutes);
//project
app.use("/api/projects", projectRoutes);
//module
app.use("/api/modules", moduleRoutes);
//workAssign
app.use("/api/workassign", workAssignRoutes);


const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Database connection failed:", err));
