import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Client = sequelize.define("Client", {
    client_id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    clientName: { type: DataTypes.STRING, allowNull: false },
    branchName: { type: DataTypes.STRING, allowNull: false },
    contactNumber: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    contactPerson: { type: DataTypes.STRING, allowNull: false }
});

export default Client;
