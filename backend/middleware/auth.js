import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ IMPORTANT: Standardize user format
    req.user = {
      _id: decoded._id,   // 👈 MUST match your controllers
    };

    next();
  } catch (error) {
    console.log("Auth error:", error.message);

    // 🔥 Better error handling
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authUser;