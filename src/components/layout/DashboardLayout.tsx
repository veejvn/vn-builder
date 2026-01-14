"use client";

import React from "react";
import Header from "./Header";
import { View } from "@/types";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleNavigate = (view: View) => {
    switch (view) {
      case View.ADMIN:
        router.push("/admin");
        break;
      case View.WORKSPACES:
        router.push("/workspace");
        break;
      case View.PROJECTS:
        router.push("/project");
        break;
      case View.LOGIN:
        router.push("/login");
        break;
      case View.SETTINGS:
        router.push("/settings");
        break;
      default:
        console.log(`No route defined for view: ${view}`);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-50 antialiased">
      <Header onNavigate={handleNavigate} />
      {children}
    </div>
  );
};

export default DashboardLayout;
