"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Layers,
  Users,
  Package,
  Database,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Projects", href: "/admin/projects", icon: Package },
    { name: "Workspaces", href: "/admin/workspaces", icon: Database },
    { name: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  const onBack = () => {
    router.push("/");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display overflow-hidden h-screen w-full flex">
      {/* Sidebar */}
      <aside className="w-64 flex-col border-r border-border-dark bg-surface-darker hidden md:flex shrink-0">
        <div className="flex flex-col h-full p-4">
          {/* Branding */}
          <div
            className="flex items-center gap-3 mb-8 px-2 cursor-pointer"
            onClick={onBack}
          >
            <div className="bg-primary/20 p-2 rounded-lg">
              <Layers className="text-primary" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold leading-none">
                VNBuilder
              </h1>
              <span className="text-[#9da8b9] text-xs font-medium mt-1">
                Admin Console
              </span>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-[#282f39] text-[#9da8b9] hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          {/* User Profile */}
          <div className="mt-auto border-t border-border-dark pt-4">
            <div className="flex items-center gap-3 px-2">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-border-dark"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWjjLLbh_T4C6zQVpg1vs11DnHi7XZhI-pC_gyENg_1M8A0EMs8wbIxMKFWORSHe0Ps_7FP5pUm4ZQ2rZoXkzdbLM3gEuY7FNYqN_nMov83O76RfISVEFvXCSDthOq5EjF9U12Rau1qimktTYCexX5lLDdt5GTCkj9aZxXCLpARHxQe4dy6jWvDfS0nnb1NBRr1lqpLs8P07GFGq5BDtItG2Mv9Br98AXnDuzfy6yOxyGE0BBRt3OV59pVkmNw0xx-mcN6ParxV0s")',
                }}
              ></div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-white text-sm font-medium truncate">
                  Tom Cook
                </span>
                <span className="text-[#9da8b9] text-xs truncate">
                  Super Admin
                </span>
              </div>
              <button className="ml-auto text-[#9da8b9] hover:text-white transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border-dark bg-surface-darker">
          <div className="flex items-center gap-2" onClick={onBack}>
            <Layers className="text-primary" size={24} />
            <span className="font-bold text-white">VNBuilder</span>
          </div>
          <button className="text-white">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-300 mx-auto p-6 md:p-8 flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-[#9da8b9]">
              <Link
                href="/admin"
                className="hover:text-white transition-colors cursor-pointer text-[#9da8b9]"
              >
                Admin
              </Link>
              <ChevronRight size={16} />
              <span className="text-white font-medium">
                {navItems.find((item) => item.href === pathname)?.name ||
                  "Dashboard"}
              </span>
              <div className="ml-auto">
                <ModeToggle />
              </div>
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
