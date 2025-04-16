import sequelize from "./config/db.js";
import User from "./models/User.js";

const seedUsers = async () => {
    try {
        await sequelize.sync({ force: false }); // Ensure DB connection
        console.log("✅ Database synced successfully!");

        const userCount = await User.count(); // Check if users exist
        if (userCount === 0) {
            // Create users one by one to trigger `beforeCreate` hook
            await User.create({ username: "admin1", password: "adminpass", role: "Admin" });
            await User.create({ username: "manager1", password: "managerpass", role: "Manager" });
            await User.create({ username: "emp123", password: "employeepass", role: "Employee" });

            console.log("✅ Default users added with hashed passwords!");
        } else {
            console.log("⚠️ Users already exist. No changes made.");
        }

        process.exit(); // Exit script after execution
    } catch (error) {
        console.error("❌ Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
