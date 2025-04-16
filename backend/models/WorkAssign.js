import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employee from "./Employee.js";
import Module from "./Module.js";

const WorkAssign = sequelize.define("WorkAssign", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: { // 🔁 Changed from employee_id
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: "userId", // 👈 Reference the actual PK in Employee
        },
    },
    module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Module,
            key: "id",
        },
    },
    workType: {
        type: DataTypes.ENUM("Support", "New Module", "Existing Issues"),
        allowNull: false,
    },
    start_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Pending", "In Progress", "Completed", "On Hold"),
        allowNull: false,
        defaultValue: "Pending",
    },
    expected_completion_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reference_photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// ⛓ Relationships
Employee.hasMany(WorkAssign, { foreignKey: "userId", onDelete: "CASCADE" });
WorkAssign.belongsTo(Employee, { foreignKey: "userId" });

Module.hasMany(WorkAssign, { foreignKey: "module_id", onDelete: "CASCADE" });
WorkAssign.belongsTo(Module, { foreignKey: "module_id" });

export default WorkAssign;
