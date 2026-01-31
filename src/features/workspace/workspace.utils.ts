import { IWorkspace } from "@/models/Workspace";
import { Workspace } from "./workspace.types";

export const mapToWorkspace = (iWorkspace: IWorkspace): Workspace => {
  return {
    id: iWorkspace._id.toString(),
    name: iWorkspace.name,
    description: iWorkspace.description,
    ownerId: iWorkspace.owner.toString(),
    members: iWorkspace.members.map((member) => ({
      user: member.user.toString(),
      role: member.role,
    })),
    createdAt: iWorkspace.createdAt.toISOString(),
    updatedAt: iWorkspace.updatedAt.toISOString(),
    // Default values for UI specific properties
    icon: "layout-dashboard", // You might want to derive this from somewhere or make it customizable
    colorClass: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400", // Customizable
  };
};
