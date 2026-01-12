"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bell, HelpCircle } from "lucide-react";
import { View } from "@/types";

interface HeaderProps {
  onNavigate?: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {

    const pathname = usePathname();

    if (pathname.startsWith('/builder')) {
        return null;
    }
    return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              VNBuilder
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <HelpCircle size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={() => onNavigate?.(View.ADMIN)}
              className="group relative flex h-9 w-9 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDY8iTOH5QromrRs6CC2JFvhP4Sd_lQIJ-S_s6ZS7a5gjIDgBuJAHf34j-_hTcle0DFO4MsKfa77Zdd6hMjkCRPZ6KSU0hS1KyR6W6NcmLHR1pQQdt9jbYwUYsFYTvi5U11OZRPu4KRR6umpWjsuX5NUW3APEjaSzfdn982EddG4MTrVgua-ASaRaRX-VlrUTeSeGnp1PV4bsNlVN1M4ja5Vno49P5GHq-tYcJKpJATYXP-YCWmUSfNU4i2hW4lDjXb-W8m9zZVSS4")',
                }}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
