import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">

      <div className="mx-auto  px-6 py-10">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Logo */}

          <div>

            <div className="mb-4 flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] text-white">
                <FileText size={18} />
              </div>

              <div>

                <h2 className="font-bold">
                  YourForm
                </h2>

                <p className="text-sm text-[#757681]">
                  Dynamic Form Builder
                </p>

              </div>

            </div>

            <p className="text-sm text-[#757681] leading-6">
              Create beautiful forms, surveys and workflows in minutes.
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-4 font-semibold">
              Product
            </h3>

            <div className="space-y-2">

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Features
              </Link>

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Templates
              </Link>

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Integrations
              </Link>

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="mb-4 font-semibold">
              Company
            </h3>

            <div className="space-y-2">

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                About
              </Link>

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Blog
              </Link>

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Careers
              </Link>

            </div>

          </div>

          {/* Legal */}

          <div>

            <h3 className="mb-4 font-semibold">
              Legal
            </h3>

            <div className="space-y-2">

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Privacy
              </Link>

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Terms
              </Link>

              <Link className="block text-sm text-[#757681] hover:text-[#2563EB]" to="/">
                Cookies
              </Link>

            </div>

          </div>

        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-[#757681] md:flex-row">

          <p>
            © 2026 YourForm. All rights reserved.
          </p>

          <p>
            Built with ❤️ using React + Vite
          </p>

        </div>

      </div>

    </footer>
  );
}