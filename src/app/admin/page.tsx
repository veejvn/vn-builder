"use client";

import React from "react";
import { Users, Briefcase, FileCode, Activity, Loader2 } from "lucide-react";
import { DashboardStats } from "@/features/admin/admin.types";
import { useAdminStats } from "@/features/admin/hooks/useAdminData";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: loading, isError: error } = useAdminStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      description: `${stats?.activeUsers || 0} active currently`,
    },
    {
      title: "Total Workspaces",
      value: stats?.totalWorkspaces || 0,
      icon: Briefcase,
      color: "bg-purple-500",
      description: "Active workspaces",
    },
    {
      title: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: FileCode,
      color: "bg-emerald-500",
      description: "Projects created",
    },
    {
      title: "System Status",
      value: "Healthy",
      icon: Activity,
      color: "bg-amber-500",
      description: "All services operational",
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center p-12 text-red-500">
        Failed to load dashboard stats
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-[#9da8b9] mt-1 text-base">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-surface-darker border border-border-dark p-6 rounded-xl relative overflow-hidden group hover:border-border-active transition-all duration-200"
            >
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-[#9da8b9] font-medium text-sm mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-white tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-white`}
                >
                  <stat.icon size={24} className="text-slate-700 dark:text-white" />
                </div>
              </div>
              <p className="text-[#64748b] text-xs mt-4">{stat.description}</p>

              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity or Chart Placeholder could go here */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-darker border border-border-dark p-6 rounded-xl flex flex-col items-center justify-center text-center py-12">
          <Activity className="text-slate-700 mb-4" size={48} />
          <p className="text-[#9da8b9]">Analytics Charts (Coming Soon)</p>
        </div>
        <div className="bg-surface-darker border border-border-dark p-6 rounded-xl flex flex-col items-center justify-center text-center py-12">
          <Users className="text-slate-700 mb-4" size={48} />
          <p className="text-[#9da8b9]">Recent Activity Stream (Coming Soon)</p>
        </div>
      </div>
    </>
  );
}
