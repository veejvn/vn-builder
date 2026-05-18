import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import JSZip from "jszip";

import { authOptions } from "@/lib/auth";
import { ProjectService } from "@/features/project/project.service";
import { WorkspaceService } from "@/features/workspace/workspace.service";
import { generateProject, sanitizeFilename } from "@/features/codegen";

interface Context {
  params: Promise<{
    projectId: string;
  }>;
}

export async function POST(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await context.params;

    if (!mongoose.isValidObjectId(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await ProjectService.getProjectById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const workspace = await WorkspaceService.getWorkspaceById(
      project.workspaceId.toString()
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
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body?.schema) {
      return NextResponse.json(
        { message: "Missing schema" },
        { status: 400 }
      );
    }

    const generatedProject = generateProject(body.schema);
    const zip = new JSZip();
    const exportFolder = zip.folder("vn-builder-export");

    generatedProject.files.forEach((file) => {
      exportFolder?.file(file.path, file.content);
    });

    const zipContent = await zip.generateAsync({ type: "arraybuffer" });
    const filename = `${sanitizeFilename(project.name)}.zip`;

    return new NextResponse(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    console.error("[API/PROJECT/[ID]/EXPORT/POST]", error);
    return NextResponse.json(
      { message: "Failed to export project code" },
      { status: 500 }
    );
  }
}
