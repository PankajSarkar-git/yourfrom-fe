import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Forms",
    path: "/forms",
    icon: FileText,
  },
  {
    label: "Responses",
    path: "/responses",
    icon: ClipboardList,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];