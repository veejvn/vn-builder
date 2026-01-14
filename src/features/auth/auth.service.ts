import connectDB from '@/lib/db';
import User, { IUser } from '@/models/User';

export class AuthService {
  /**
   * Lấy thông tin người dùng hiện tại từ database
   */
  static async getCurrentUser(email: string): Promise<IUser | null> {
    await connectDB();
    return User.findOne({ email }).select('-password');
  }

  /**
   * Cập nhật thông tin profile
   */
  static async updateProfile(email: string, data: Partial<IUser>): Promise<IUser | null> {
    await connectDB();
    return User.findOneAndUpdate({ email }, { $set: data }, { new: true }).select('-password');
  }
}
