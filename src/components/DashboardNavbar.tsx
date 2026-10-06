import { Bell, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useLogout } from "../hook/useAuth";

export default function DashboardNavbar() {
  const logout = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      <div>
        <h1 className="text-xl font-semibold">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

        <Button
          variant="ghost"
          size="icon"
        >
          <Bell size={20} />
        </Button>

        <UserCircle
          size={34}
          className="text-slate-500"
        />

        <Button
          variant="outline"
          onClick={() => logout.mutate()}
        >
          Logout
        </Button>

      </div>

    </header>
  );
}