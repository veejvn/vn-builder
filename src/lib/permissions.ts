import { Session } from "next-auth";

export const isAdmin = (session: Session | null) => {
  return session?.user && (session.user as any).role === "ADMIN";
};

export const hasRole = (session: Session | null, role: string) => {
  return session?.user && (session.user as any).role === role;
};
