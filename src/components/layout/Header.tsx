"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  HelpCircle,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { View } from "@/types";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface HeaderProps {
  onNavigate?: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/builder")) {
    return null;
  }

  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || userEmail.split("@")[0] || "User";
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/workspace" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                <LayoutDashboard size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                VNBuilder
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <HelpCircle size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group relative flex h-9 w-9 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark cursor-pointer">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={userName}
                    />
                    <AvatarFallback className="bg-primary text-white text-[10px] font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(session?.user as any)?.role === "ADMIN" && (
                  <DropdownMenuItem
                    onClick={() => onNavigate?.(View.ADMIN)}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onNavigate?.(View.SETTINGS)}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
