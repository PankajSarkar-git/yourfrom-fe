import { useState } from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { sidebarItems } from "../constants/sidebar-data";
import { cn } from "../lib/utils";

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative h-screen border-r bg-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b px-4 py-[13.75px]",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <h2 className="text-xl font-bold text-[#2563EB]">YourForm</h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 transition hover:bg-slate-100"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 p-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-xl transition-all duration-200",
                  collapsed
                    ? "justify-center p-3"
                    : "gap-3 px-4 py-3",
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#2563EB]"
                )
              }
            >
              <Icon size={20} className="shrink-0" />

              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}