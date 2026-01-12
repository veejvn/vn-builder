"use client";

import React from "react";
import Header from "./Header";
import { View } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const handleNavigate = (view: View) => {
    // Logic điều hướng có thể được thêm ở đây hoặc truyền qua context
    console.log(`Navigating to ${view}`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-50 antialiased">
      <Header onNavigate={handleNavigate} />
      {children}
    </div>
  );
};

export default DashboardLayout;
