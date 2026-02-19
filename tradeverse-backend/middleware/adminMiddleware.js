import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
    try {
        // req.user is set by the authMiddleware (which must be called before this)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const user = await User.findById(req.user.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error checking admin status" });
    }
};

export default adminMiddleware;
