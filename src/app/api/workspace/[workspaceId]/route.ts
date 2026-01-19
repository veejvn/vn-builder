import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WorkspaceService } from "@/features/workspace/workspace.service";
import { mapToWorkspace } from "@/features/workspace/workspace.utils";

interface Context {
  params: {
    workspaceId: string; // Changed from 'id'
  };
}

export async function GET(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { workspaceId } = context.params; // Changed from 'id'
    const iWorkspace = await WorkspaceService.getWorkspaceById(workspaceId);

    if (!iWorkspace) {
      return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
    }

    // Check if the user is a member of the workspace
    const isMember = iWorkspace.members.some(
      (member) => member.user.toString() === session.user.id
    );

    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const workspace = mapToWorkspace(iWorkspace);
    return NextResponse.json(workspace);
  } catch (error) {
    console.error("[API/WORKSPACE/[WORKSPACEID]/GET]", error); // Updated log
    return NextResponse.json({ message: "Failed to fetch workspaces" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { workspaceId } = context.params; // Changed from 'id'
    const { name, description } = await req.json();

    const iWorkspace = await WorkspaceService.getWorkspaceById(workspaceId);

    if (!iWorkspace) {
      return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
    }

    // Check if the user is the owner of the workspace
    if (iWorkspace.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedIWorkspace = await WorkspaceService.updateWorkspace(workspaceId, { name, description }); // Changed from 'id'
    if (!updatedIWorkspace) {
      return NextResponse.json({ message: "Failed to update workspace" }, { status: 500 });
    }
    const updatedWorkspace = mapToWorkspace(updatedIWorkspace);
    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    console.error("[API/WORKSPACE/[WORKSPACEID]/PUT]", error); // Updated log
    return NextResponse.json({ message: "Failed to update workspace" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { workspaceId } = context.params; // Changed from 'id'

    const iWorkspace = await WorkspaceService.getWorkspaceById(workspaceId);

    if (!iWorkspace) {
      return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
    }

    // Check if the user is the owner of the workspace
    if (iWorkspace.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const success = await WorkspaceService.deleteWorkspace(workspaceId); // Changed from 'id'
    if (!success) {
      return NextResponse.json({ message: "Failed to delete workspace" }, { status: 500 });
    }

    return NextResponse.json({ message: "Workspace deleted" }, { status: 200 });
  } catch (error) {
    console.error("[API/WORKSPACE/[WORKSPACEID]/DELETE]", error); // Updated log
    return NextResponse.json({ message: "Failed to delete workspace" }, { status: 500 });
  }
}
