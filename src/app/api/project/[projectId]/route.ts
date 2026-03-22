import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProjectService } from "@/features/project/project.service";
import { WorkspaceService } from "@/features/workspace/workspace.service";
import { mapToProject } from "@/features/project/project.utils";

interface Context {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await context.params;
    const { projectId } = params;
    const iProject = await ProjectService.getProjectById(projectId);

    if (!iProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if the user is a member of the project's workspace
    const workspace = await WorkspaceService.getWorkspaceById(
      iProject.workspaceId.toString()
    );
    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found for this project" },
        { status: 404 }
      );
    }

    const isMember = workspace.members.some(
      (member) => member.user._id.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const project = mapToProject(iProject);
    return NextResponse.json(project);
  } catch (error) {
    console.error("[API/PROJECT/[ID]/GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await context.params;
    const { projectId } = params;
    const { name, description, schema, status, thumbnail } = await req.json();

    const iProject = await ProjectService.getProjectById(projectId);

    if (!iProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner or editor of the project's workspace
    const workspace = await WorkspaceService.getWorkspaceById(
      iProject.workspaceId.toString()
    );
    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found for this project" },
        { status: 404 }
      );
    }

    const memberRole = workspace.members.find(
      (member) => member.user._id.toString() === session.user.id
    )?.role;

    if (!memberRole || (memberRole !== "OWNER" && memberRole !== "EDITOR")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedIProject = await ProjectService.updateProject(projectId, {
      name,
      description,
      schema,
      status: status === "Live" ? "PUBLISHED" : "DRAFT",
      thumbnail,
    });

    if (!updatedIProject) {
      return NextResponse.json(
        { message: "Failed to update project" },
        { status: 500 }
      );
    }

    const updatedProject = mapToProject(updatedIProject);
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("[API/PROJECT/[ID]/PUT]", error);
    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await context.params;
    const { projectId } = params;

    const iProject = await ProjectService.getProjectById(projectId);

    if (!iProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the project's workspace
    const workspace = await WorkspaceService.getWorkspaceById(
      iProject.workspaceId.toString()
    );
    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found for this project" },
        { status: 404 }
      );
    }

    if (workspace.owner._id.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const success = await ProjectService.deleteProject(projectId);
    if (!success) {
      return NextResponse.json(
        { message: "Failed to delete project" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("[API/PROJECT/[ID]/DELETE]", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
