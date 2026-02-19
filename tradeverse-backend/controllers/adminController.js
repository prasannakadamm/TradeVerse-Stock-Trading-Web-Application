import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding passwords
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        // Calculate simple stats
        const totalUsers = users.length;
        const totalBalance = users.reduce((acc, user) => acc + (user.balance || 0), 0);

        res.status(200).json({
            users,
            stats: {
                totalUsers,
                totalBalance
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specific user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
