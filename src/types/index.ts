export enum View {
  LOGIN = 'LOGIN',
  WORKSPACES = 'WORKSPACES',
  PROJECTS = 'PROJECTS',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  role?: string;
}