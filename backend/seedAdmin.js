import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import connectDB from "./config/db.js";

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@tradeverse.com";
        const password = "adminpassword123";
        const name = "Super Admin";

        // Check if admin already exists
        let user = await User.findOne({ email });

        if (user) {
            console.log("Admin user already found. Promoting to role: admin");
            user.role = "admin";
            await user.save();
            console.log("Existing user promoted to Admin.");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: "admin",
                balance: 10000000 // Rich admin
            });
            console.log("New Admin user created.");
        }

        console.log("Email:", email);
        console.log("Password:", password);
        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
