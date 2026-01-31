import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WorkspaceService } from '@/features/workspace/workspace.service';
import { mapToWorkspace } from '@/features/workspace/workspace.utils';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const iWorkspaces = await WorkspaceService.getUserWorkspaces(session.user.id as string);
    const workspaces = iWorkspaces.map(mapToWorkspace);
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('[API/WORKSPACE/GET]', error);
    return NextResponse.json({ message: 'Failed to fetch workspaces' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Workspace name is required' }, { status: 400 });
    }

    const newIWorkspace = await WorkspaceService.createWorkspace({
      name,
      description,
      ownerId: session.user.id as string,
    });
    const newWorkspace = mapToWorkspace(newIWorkspace);
    return NextResponse.json(newWorkspace, { status: 201 });
  } catch (error) {
    console.error('[API/WORKSPACE/POST]', error);
    return NextResponse.json({ message: 'Failed to create workspace' }, { status: 500 });
  }
}
