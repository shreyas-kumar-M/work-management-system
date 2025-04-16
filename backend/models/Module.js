import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Project from "./Project.js";

const Module = sequelize.define("Module", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    moduleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Project,
            key: "id",
        },
    },
});

Project.hasMany(Module, { foreignKey: "project_id", onDelete: "CASCADE" });
Module.belongsTo(Project, { foreignKey: "project_id" });

export default Module;
