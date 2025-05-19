"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AuthBackground({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
      <div 
        className={cn(
          "absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]",
          "opacity-0 transition-opacity duration-1000",
          mounted && "opacity-100"
        )}
      />
      <div 
        className={cn(
          "absolute left-[50%] top-0 -z-10 h-[600px] w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-tr from-primary/20 to-purple-400/20 blur-3xl",
          "opacity-0 transform translate-y-[-50px] transition-all duration-1000 ease-out",
          mounted && "opacity-70 translate-y-0"
        )} 
      />
      <div 
        className={cn(
          "absolute right-[25%] bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-indigo-400/20 to-teal-400/20 blur-3xl",
          "opacity-0 transform translate-y-[50px] transition-all duration-1000 ease-out delay-300",
          mounted && "opacity-70 translate-y-0"
        )}
      />
      <div 
        className={cn(
          "absolute left-[20%] bottom-[20%] -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 blur-3xl",
          "opacity-0 transform translate-y-[50px] transition-all duration-1000 ease-out delay-500",
          mounted && "opacity-70 translate-y-0"
        )}
      />
      {children}
    </div>
  );
}