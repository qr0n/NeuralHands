import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ---------- Database Connection & Server Startup ----------
if (process.env.NODE_ENV === "development") {
  (async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Failed to connect to database:", error);
      process.exit(1);
    }
  })();
}

// Export for testing (without starting server)
export { app };
