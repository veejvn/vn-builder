"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as any;
  const initial = user.name?.[0] || user.email?.[0] || "?";

  return (
    <div className="mt-auto border-t border-border-dark pt-4">
      <div className="flex items-center gap-3 px-2">
        <div className="flex items-center justify-center rounded-full size-9 ring-2 ring-border-dark bg-primary/20 text-primary font-bold uppercase">
          {initial}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white text-sm font-medium truncate">
            {user.name || "User"}
          </span>
          <span className="text-[#9da8b9] text-xs truncate">
            {user.role || "Member"}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="ml-auto text-[#9da8b9] hover:text-white transition-colors"
          title="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
