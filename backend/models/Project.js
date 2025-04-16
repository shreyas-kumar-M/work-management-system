import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Client from "./Client.js";

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  client_id: {  // ✅ Match the column name with Client model
    type: DataTypes.UUID,  // ✅ Ensure it matches Client's primary key type
    allowNull: false,
    references: {
      model: Client, // ✅ Use the model variable, NOT a string
      key: "client_id",
    },
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// In Client model
Client.hasMany(Project, {
    foreignKey: 'client_id',
    as: 'projects'
  });
// ✅ Define relationships with correct foreign keys
Client.hasMany(Project, { foreignKey: "client_id", onDelete: "CASCADE" });
Project.belongsTo(Client, { foreignKey: "client_id" });

export default Project;
