import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check token existence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    // ✅ Standardize structure
    req.admin = {
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.log("Admin auth error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin token expired, login again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid admin token",
    });
  }
};

export default adminAuth;