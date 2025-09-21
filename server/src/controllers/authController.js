import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_for_dev"; // TEMPORARY FALLBACK
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always secure for production cross-domain
      sameSite: "None", // Required for cross-domain cookies
      maxAge: 1000 * 60 * 60 * 24 * 7
      // Removed domain restriction to allow cross-domain cookies
    });

    res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("=== LOGIN DEBUG ===");
    console.log("Login request body:", req.body);
    console.log("Login request headers:", req.headers);
    
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    console.log("✅ Login successful for user:", email);
    console.log("Token created:", token.substring(0, 20) + "...");
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always secure for production cross-domain
      sameSite: "None", // Required for cross-domain cookies
      maxAge: 1000 * 60 * 60 * 24 * 7
      // Removed domain restriction to allow cross-domain cookies
    });

    console.log("Cookie set successfully");
    console.log("==================");
    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    if (!token) return res.status(200).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "fallback_jwt_secret_for_dev"); // TEMPORARY FALLBACK
    const user = await User.findById(payload.id).select("-passwordHash");
    res.json({ user });
  } catch (err) {
    return res.status(200).json({ user: null });
  }
};
