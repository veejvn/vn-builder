'use client';

import { IWorkspace } from '@/models/Workspace';

interface WorkspaceTableProps {
  workspaces: IWorkspace[];
}

export function WorkspaceTable({ workspaces }: WorkspaceTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 transition-colors">
            <th className="h-10 px-4 text-left font-medium">Name</th>
            <th className="h-10 px-4 text-left font-medium">Owner</th>
            <th className="h-10 px-4 text-left font-medium">Members</th>
            <th className="h-10 px-4 text-left font-medium">Created At</th>
          </tr>
        </thead>
        <tbody>
          {workspaces.map((workspace) => (
            <tr key={String(workspace._id)} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 font-medium">{workspace.name}</td>
              <td className="p-4">{String(workspace.owner)}</td>
              <td className="p-4">{workspace.members.length}</td>
              <td className="p-4">{new Date(workspace.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {workspaces.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-muted-foreground">
                No workspaces found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
