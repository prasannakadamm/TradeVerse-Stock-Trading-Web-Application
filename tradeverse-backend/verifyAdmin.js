import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import connectDB from "./config/db.js";

const verifyAdminCredentials = async () => {
    try {
        await connectDB();
        const email = "admin@tradeverse.com";
        const passwordAttempt = "adminpassword123";

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User NOT FOUND in database.");
        } else {
            console.log(`User found: ${user.name}`);
            console.log(`Role: ${user.role}`);

            const isMatch = await bcrypt.compare(passwordAttempt, user.password);
            if (isMatch) {
                console.log("SUCCESS: Password matches!");
            } else {
                console.log("FAILURE: Password does NOT match.");

                // Fix it automatically
                console.log("Reseting password to 'adminpassword123'...");
                user.password = await bcrypt.hash(passwordAttempt, 10);
                await user.save();
                console.log("Password has been reset.");
            }
        }
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

verifyAdminCredentials();
