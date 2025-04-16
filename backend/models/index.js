import User from "./User.js";
import Employee from "./Employee.js";

// Define one-to-one association (if every Employee is also a User)
User.hasOne(Employee, { foreignKey: "userId", onDelete: "CASCADE" });
Employee.belongsTo(User, { foreignKey: "userId" });

export { User, Employee };
