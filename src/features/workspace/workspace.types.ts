export interface Workspace {
  id: string; // Changed from _id in IWorkspace
  name: string;
  description?: string;
  ownerId: string; // ID of the owner user
  members: Array<{ user: string; role: "OWNER" | "EDITOR" | "VIEWER" }>; // Array of member user IDs and roles
  createdAt: string; // Date string
  updatedAt: string; // Date string
  icon?: string; // UI specific
  colorClass?: string; // UI specific
}
