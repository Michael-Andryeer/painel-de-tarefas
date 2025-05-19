"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AuthCard({ children, activeTab, onTabChange }: AuthCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full max-w-md overflow-hidden rounded-xl bg-white/80 backdrop-blur-xl shadow-xl dark:bg-gray-900/80",
        "border border-gray-200 dark:border-gray-800",
        "transition-all duration-500"
      )}
    >
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 dark:from-gray-800/5 dark:to-gray-800/30 opacity-0",
          "transition-opacity duration-500",
          mounted && "opacity-100"
        )}
      />
      
      {/* Card header with tabs */}
      <div className="relative px-1 pt-4">
        <div 
          className="flex mb-2 relative z-10 rounded-lg p-1 mx-4 bg-gray-100 dark:bg-gray-800"
        >
          <TabButton 
            active={activeTab === "login"} 
            onClick={() => onTabChange("login")}
          >
            Login
          </TabButton>
          <TabButton 
            active={activeTab === "register"} 
            onClick={() => onTabChange("register")}
          >
            Cadastro
          </TabButton>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      className={cn(
        "relative flex-1 py-2 text-sm font-medium text-center rounded-md transition-all duration-200",
        active 
          ? "text-gray-900 dark:text-white" 
          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      )}
      onClick={onClick}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}