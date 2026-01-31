import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProjectService } from "@/features/project/project.service";
import { WorkspaceService } from "@/features/workspace/workspace.service";
import { mapToProject } from "@/features/project/project.utils";

interface Context {
  params: Promise<{
    workspaceId: string;
  }>;
}

export async function GET(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await context.params;
    const { workspaceId } = params;

    const workspace = await WorkspaceService.getWorkspaceById(workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    // Check if the user is a member of the workspace
    const isMember = workspace.members.some(
      (member) => member.user._id.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const iProjects = await ProjectService.getWorkspaceProjects(workspaceId);
    const projects = iProjects.map(mapToProject);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[API/WORKSPACE/[WORKSPACEID]/PROJECTS/GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await context.params;
    const { workspaceId } = params;
    const { name, description, schema } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    const workspace = await WorkspaceService.getWorkspaceById(workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    // Check if the user is an owner or editor of the workspace to create projects
    const memberRole = workspace.members.find(
      (member: any) => member.user._id.toString() === session.user.id
    )?.role;

    if (!memberRole || (memberRole !== "OWNER" && memberRole !== "EDITOR")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const newIProject = await ProjectService.createProject({
      name,
      description,
      workspaceId,
      ownerId: session.user.id as string,
      schema: schema || {},
    });
    const newProject = mapToProject(newIProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("[API/WORKSPACE/[WORKSPACEID]/PROJECTS/POST]", error);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
