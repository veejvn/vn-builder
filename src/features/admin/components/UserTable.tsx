'use client';

import { IUser } from '@/models/User';

interface UserTableProps {
  users: IUser[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 transition-colors">
            <th className="h-10 px-4 text-left font-medium">Name</th>
            <th className="h-10 px-4 text-left font-medium">Email</th>
            <th className="h-10 px-4 text-left font-medium">Role</th>
            <th className="h-10 px-4 text-left font-medium">Status</th>
            <th className="h-10 px-4 text-left font-medium">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={String(user._id)} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4">{user.name || 'N/A'}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">
                <span className={`rounded-full px-2 py-1 text-xs ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <span className={`rounded-full px-2 py-1 text-xs ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {user.status}
                </span>
              </td>
              <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
