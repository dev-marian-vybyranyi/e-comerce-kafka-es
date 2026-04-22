import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full border rounded-lg py-2 text-sm outline-none transition-all
            focus:ring-2 focus:ring-gray-900 focus:border-transparent
            ${icon ? "pl-9 pr-3" : "px-3"}
            ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}
            ${className}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  ),
);

Input.displayName = "Input";
