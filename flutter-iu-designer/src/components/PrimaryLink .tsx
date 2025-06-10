import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface PrimaryLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

// const baseClass = 
//   "inline-block px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition";
const baseClass = 
  "inline-block px-4 py-1 text-base rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition";

const PrimaryLink = ({ to, children, className = "" }: PrimaryLinkProps) => (
  <Link to={to} className={`${baseClass} ${className}`.trim()}>
    {children}
  </Link>
);

export default PrimaryLink;