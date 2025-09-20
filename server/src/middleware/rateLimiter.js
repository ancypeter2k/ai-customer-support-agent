import rateLimit from "express-rate-limit";

console.log("NODE_ENV from rateLimiter.js:", process.env.NODE_ENV); // THIS LINE MUST BE PRESENT

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 200 : 10000, // Increased for local development
  message: { message: "Too many requests, please slow down" }
});