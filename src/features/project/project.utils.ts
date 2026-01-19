import { IProject } from "@/models/Project";
import { Project } from "./project.types";

export const mapToProject = (iProject: IProject): Project => {
  return {
    id: iProject._id.toString(),
    name: iProject.name,
    description: iProject.description,
    url: "", // Placeholder: project URL needs to be generated or derived
    thumbnail: iProject.thumbnail || "",
    status: iProject.status === "DRAFT" ? "Draft" : "Live", // Map backend status to frontend status
    statusColor: iProject.status === "DRAFT" ? "gray" : "green", // Map backend status to frontend color
    updated: new Date(iProject.updatedAt).toLocaleDateString(),
  };
};
