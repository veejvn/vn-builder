export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  workspaceId: Workspace | string;
  owner: User | string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalProjects: number;
  activeUsers: number; // Users not soft deleted
}

export interface GetUsersResponse {
  users: User[];
  pagination: PaginationData;
}

export interface GetWorkspacesResponse {
  workspaces: Workspace[];
  pagination: PaginationData;
}

export interface GetProjectsResponse {
  projects: Project[];
  pagination: PaginationData;
}
