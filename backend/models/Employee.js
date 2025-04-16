import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js"; // ✅ Import the User model


const Employee = sequelize.define("Employee", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // 👈 make it PRIMARY KEY
        references: {
            model: User,
            key: "id",
        },
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.ENUM("Male", "Female", "Other"), allowNull: false },
    mobileNumber: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    permanentAddress: { type: DataTypes.TEXT, allowNull: false },
    contactAddress: { type: DataTypes.TEXT, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    joiningDate: { type: DataTypes.DATE, allowNull: false },
    designation: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("Admin", "Manager", "Employee"), allowNull: false },
});

// Define relationship (One-to-One: Each Employee has one User)

Employee.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Employee, { foreignKey: "userId" });



export default Employee;
