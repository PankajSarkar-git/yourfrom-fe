import { Link, NavLink } from "react-router-dom";
import { FileText, Menu } from "lucide-react";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Templates",
    href: "/templates",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] text-white">
            <FileText size={20} />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-900">
              YourForm
            </h1>

            <p className="text-xs text-[#757681]">
              Dynamic Form Builder
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#2563EB]"
                    : "text-[#757681] hover:text-[#2563EB]"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Buttons */}

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" >
            <Link to="/login">Login</Link>
          </Button>

          <Button
            className="bg-[#2563EB] hover:bg-blue-700"
            
          >
            <Link to="/signup">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}

        <div className="lg:hidden">
          <Sheet>

            <SheetTrigger >
              <Button
                size="icon"
                variant="ghost"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[280px]"
            >
              <div className="mt-10 flex flex-col gap-2">

                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="justify-start"
                    
                  >
                    <NavLink to={item.href}>
                      {item.title}
                    </NavLink>
                  </Button>
                ))}

                <div className="my-4 border-t" />

                <Button
                  variant="outline"
                  
                >
                  <Link to="/login">
                    Login
                  </Link>
                </Button>

                <Button
                  className="bg-[#2563EB] hover:bg-blue-700"
                  
                >
                  <Link to="/signup">
                    Get Started
                  </Link>
                </Button>

              </div>
            </SheetContent>

          </Sheet>
        </div>

      </div>
    </header>
  );
}