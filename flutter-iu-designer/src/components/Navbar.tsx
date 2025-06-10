import type { ReactNode } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface NavbarProps {
  children?: ReactNode;
  href?: string;
}

const Navbar = ({ children, href = "/" }: NavbarProps) => (
  <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/90 shadow">
    <div className="flex items-center gap-2">
      <Bars3Icon className="h-8 w-8 text-indigo-600" />
      <a
        className="text-xl font-bold text-indigo-700 hover:underline cursor-pointer"
        href={href}
      >
        Flutter UI Designer
      </a>
    </div>
    <div className="flex items-center gap-4">{children}</div>
  </nav>
);

export default Navbar;
