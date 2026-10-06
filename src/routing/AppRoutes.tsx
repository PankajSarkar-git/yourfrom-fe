import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../components/layout/PublicLayout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Forms from "../pages/forms/Forms";
import Responses from "../pages/responses/Responses";
import Users from "../pages/users/Users";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";
import CreateFormPage from "../pages/forms/CreateFormPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages with Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

        {/* Protected Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/forms/create" element={<CreateFormPage />} />
            <Route path="/responses" element={<Responses />} />
            <Route path="/users" element={<Users />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
