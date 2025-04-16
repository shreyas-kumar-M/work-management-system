import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // MySQL Host
    dialect: "mysql",          // Using MySQL
    logging: false,            // Disable SQL logs in console
  }
);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

export default sequelize;
