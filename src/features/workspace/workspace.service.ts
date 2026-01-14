import connectDB from '@/lib/db';
import Workspace, { IWorkspace } from '@/models/Workspace';
import mongoose from 'mongoose';

export class WorkspaceService {
  /**
   * Lấy danh sách workspace mà người dùng là thành viên
   */
  static async getUserWorkspaces(userId: string): Promise<IWorkspace[]> {
    await connectDB();
    return Workspace.find({
      'members.user': new mongoose.Types.ObjectId(userId),
    }).sort({ updatedAt: -1 });
  }

  /**
   * Tạo workspace mới
   */
  static async createWorkspace(data: {
    name: string;
    description?: string;
    ownerId: string;
  }): Promise<IWorkspace> {
    await connectDB();
    const workspace = await Workspace.create({
      name: data.name,
      description: data.description,
      owner: new mongoose.Types.ObjectId(data.ownerId),
      members: [
        {
          user: new mongoose.Types.ObjectId(data.ownerId),
          role: 'OWNER',
        },
      ],
    });
    return workspace;
  }

  /**
   * Lấy chi tiết workspace
   */
  static async getWorkspaceById(id: string): Promise<IWorkspace | null> {
    await connectDB();
    return Workspace.findById(id).populate('members.user', 'name email');
  }

  /**
   * Cập nhật workspace
   */
  static async updateWorkspace(id: string, data: Partial<IWorkspace>): Promise<IWorkspace | null> {
    await connectDB();
    return Workspace.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  /**
   * Xóa workspace
   */
  static async deleteWorkspace(id: string): Promise<boolean> {
    await connectDB();
    const result = await Workspace.findByIdAndDelete(id);
    return !!result;
  }
}
