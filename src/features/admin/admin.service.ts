import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Project from "@/models/Project";
import { User as IUser } from "./admin.types";
import bcrypt from "bcrypt";

export const adminService = {
    // Users
    getUsers: async (
        page: number = 1,
        limit: number = 10,
        search: string = ""
    ) => {
        // List users where deletedAt is null
        const query: any = { deletedAt: null };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return {
            users: JSON.parse(JSON.stringify(users)),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    },

    createUser: async (data: any) => {
        // If password is provided, hash it.
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = await User.create(data);
        return JSON.parse(JSON.stringify(user));
    },

    updateUser: async (id: string, data: any) => {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        return JSON.parse(JSON.stringify(user));
    },

    deleteUser: async (id: string) => {
        // Soft delete by setting deletedAt
        const user = await User.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
        return JSON.parse(JSON.stringify(user));
    },

    // Workspaces
    getWorkspaces: async (
        page: number = 1,
        limit: number = 10,
        search: string = ""
    ) => {
        const query: any = { deletedAt: null };

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const total = await Workspace.countDocuments(query);
        const workspaces = await Workspace.find(query)
            .populate("owner", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return {
            workspaces: JSON.parse(JSON.stringify(workspaces)),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    },

    deleteWorkspace: async (id: string) => {
        const workspace = await Workspace.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
        return JSON.parse(JSON.stringify(workspace));
    },

    // Projects
    getProjects: async (
        page: number = 1,
        limit: number = 10,
        search: string = ""
    ) => {
        const query: any = { deletedAt: null };

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const total = await Project.countDocuments(query);
        const projects = await Project.find(query)
            .populate("owner", "name email")
            .populate("workspaceId", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return {
            projects: JSON.parse(JSON.stringify(projects)),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    },

    deleteProject: async (id: string) => {
        const project = await Project.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
        return JSON.parse(JSON.stringify(project));
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        const [totalUsers, totalWorkspaces, totalProjects, activeUsers] =
            await Promise.all([
                User.countDocuments({ deletedAt: null }),
                Workspace.countDocuments({ deletedAt: null }),
                Project.countDocuments({ deletedAt: null }),
                User.countDocuments({ deletedAt: null, status: "ACTIVE" }),
            ]);

        return {
            totalUsers,
            totalWorkspaces,
            totalProjects,
            activeUsers,
        };
    },
};
