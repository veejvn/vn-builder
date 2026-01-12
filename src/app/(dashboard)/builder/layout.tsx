import React from "react";

export default function BuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout này không bao bọc bởi DashboardLayout để tránh Header chung
  return <div className="h-screen overflow-hidden">{children}</div>;
}
