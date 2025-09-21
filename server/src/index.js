import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

console.log('--- Server Environment Variables ---');
for (const key in process.env) {
  if (key.startsWith('MONGO') || key.startsWith('JWT') || key.startsWith('CLIENT_URL') || key.startsWith('VERCEL_URL') || key.startsWith('RENDER_URL') || key.startsWith('NODE_ENV')) {
    console.log(`${key}=${process.env[key]}`);
  }
}
console.log('--- End Environment Variables ---');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

connectDB();

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      CLIENT_URL, 
      "http://localhost:8000", 
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.VERCEL_URL, 
      process.env.RENDER_URL,
      "https://ai-customer-support-agent-lpcnurj1i-ancy-peters-projects.vercel.app",
      "https://ai-customer-support-agent-opal.vercel.app"
    ];
    
    console.log("CORS - Checking origin:", origin);
    console.log("CORS - Allowed origins:", allowedOrigins);
    
    if (!origin || allowedOrigins.includes(origin)) {
      console.log("CORS - Allowed origin:", origin);
      callback(null, true);
    } else {
      console.log("CORS - Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(rateLimiter);

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => res.send("AI Support Server is running"));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
