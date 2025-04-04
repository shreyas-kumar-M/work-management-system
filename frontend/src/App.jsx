import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import Login from "../pages/Login";
import ManagerDashboard from "../pages/ManagerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeForm from "../pages/EmployeeForm"
import Client from "../pages/Client";
import Project from "../pages/ProjectCreation";
import ModuleCreation from "../pages/ModuleCreation";
import WorkAssign from "../pages/WorkAssign";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route should go to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* ✅ Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* ✅ Manager Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Route>

        {/* ✅ Employee Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["Employee"]} />}>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        </Route>
        {/* ✅ Employee creation */}
        <Route element={<ProtectedRoute allowedRoles={["Manager","Admin"]} />}>
        <Route path={"/employee-creation"} element={<EmployeeForm/>}></Route>
        </Route>
        {/* ✅ client creation */}
        <Route element={<ProtectedRoute allowedRoles={["Manager","Admin"]} />}>
        <Route path={"/client"} element={<Client/>}></Route>
        </Route>
        {/* ✅ project creation */}
        <Route element={<ProtectedRoute allowedRoles={["Manager","Admin"]} />}>
        <Route path={"/project-creation"} element={<Project/>}></Route>
        </Route>
        {/* ✅ module creation */}
        <Route element={<ProtectedRoute allowedRoles={["Manager","Admin"]} />}>
        <Route path={"/module-creation"} element={<ModuleCreation/>}></Route>
        </Route>
        {/* ✅ module creation */}
        <Route element={<ProtectedRoute allowedRoles={["Manager","Admin"]} />}>
        <Route path={"/workAssign"} element={<WorkAssign/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
