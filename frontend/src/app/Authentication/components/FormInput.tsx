"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function FormInput({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
  error,
  icon,
  endIcon,
}: FormInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full py-2.5 transition-all duration-200 ease-in-out",
            "rounded-lg border bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            icon ? "pl-10" : "pl-4",
            endIcon ? "pr-10" : "pr-4",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : focused
              ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500/20"
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500"
          )}
        />
        
        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endIcon}
          </div>
        )}
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600 dark:text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}