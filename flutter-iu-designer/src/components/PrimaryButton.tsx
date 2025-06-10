import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const baseClass =
  "inline-block px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition";

const PrimaryButton = ({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) => (
  <button className={`${baseClass} ${className}`.trim()} {...props}>
    {children}
  </button>
);

export default PrimaryButton;