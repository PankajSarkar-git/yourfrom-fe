import { Outlet } from "react-router-dom";

import DashboardNavbar from "../DashboardNavbar";
import DashboardSidebar from "../DashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      <DashboardSidebar />

      <div className="flex flex-1 flex-col">

        <DashboardNavbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}