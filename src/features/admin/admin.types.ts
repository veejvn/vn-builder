export type UserRole = "ADMIN" | "USER" | "EDITOR" | "DEVELOPER" | "VIEWER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "AWAY";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetUsersResponse {
  users: User[];
  pagination: PaginationData;
}
