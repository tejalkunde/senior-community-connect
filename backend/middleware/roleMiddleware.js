
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // Debugging logs
        console.log("USER ROLE:", req.user?.role);
        console.log("ALLOWED ROLES:", allowedRoles);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        next();
    };
};

export default authorize;