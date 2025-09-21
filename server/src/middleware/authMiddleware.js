import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    console.log("=== AUTH DEBUG ===");
    console.log("Cookies:", req.cookies);
    console.log("Authorization header:", req.headers.authorization);
    
    const token =
      req.cookies?.token ||
      (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);

    console.log("Token found:", !!token);
    console.log("Token value:", token ? token.substring(0, 20) + "..." : "none");

    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "fallback_jwt_secret_for_dev");
    console.log("Token payload:", payload);
    
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user) {
      console.log("❌ User not found for ID:", payload.id);
      return res.status(401).json({ message: "Invalid token user" });
    }

    console.log("✅ User authenticated:", user.email);
    console.log("==================");
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    console.log("==================");
    return res.status(401).json({ message: "Authentication failed" });
  }
};
