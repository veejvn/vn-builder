import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import connectDB from "../src/lib/db";
import User from "../src/models/User";
import bcrypt from "bcrypt";

if (!process.env.MONGODB_URI) {
  dotenv.config({ path: ".env" });
}

async function seed() {
  try {
    await connectDB();

    const adminEmail = "admin@vnbuilder.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      email: adminEmail,
      name: "System Admin",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    });

    console.log("Admin user created successfully");
    console.log("Email: " + adminEmail);
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
}

seed();
