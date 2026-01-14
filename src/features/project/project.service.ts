import connectDB from '@/lib/db';
import Project, { IProject } from '@/models/Project';
import mongoose from 'mongoose';

export class ProjectService {
  /**
   * Lấy danh sách dự án trong một workspace
   */
  static async getWorkspaceProjects(workspaceId: string): Promise<IProject[]> {
    await connectDB();
    return Project.find({
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
    }).sort({ updatedAt: -1 });
  }

  /**
   * Tạo dự án mới
   */
  static async createProject(data: {
    name: string;
    description?: string;
    workspaceId: string;
    ownerId: string;
    schema?: any;
  }): Promise<IProject> {
    await connectDB();
    const project = await Project.create({
      name: data.name,
      description: data.description,
      workspaceId: new mongoose.Types.ObjectId(data.workspaceId),
      owner: new mongoose.Types.ObjectId(data.ownerId),
      schema: data.schema || {},
      status: 'DRAFT',
    });
    return project;
  }

  /**
   * Lấy chi tiết dự án
   */
  static async getProjectById(id: string): Promise<IProject | null> {
    await connectDB();
    return Project.findById(id);
  }

  /**
   * Cập nhật dự án (bao gồm cả schema layout)
   */
  static async updateProject(id: string, data: Partial<IProject>): Promise<IProject | null> {
    await connectDB();
    return Project.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  /**
   * Xóa dự án
   */
  static async deleteProject(id: string): Promise<boolean> {
    await connectDB();
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  }
}
