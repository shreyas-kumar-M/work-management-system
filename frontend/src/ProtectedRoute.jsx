import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  // ✅ Default empty array
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />; // Redirect to login
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />; // Redirect if role is not allowed
  }

  return <Outlet />;
};

export default ProtectedRoute;
