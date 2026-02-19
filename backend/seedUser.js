import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const email = "demo@tradeverse.com";
        const password = "password123";
        const name = "Demo Trader";

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log("User already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            balance: 500000 // Giving some extra budget for demo
        });

        console.log(`User created successfully!`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUser();
