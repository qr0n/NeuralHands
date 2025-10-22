import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { createAccessToken } from "./jwt.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Verify token signature
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Issue new access token
    const newAccessToken = await createAccessToken(user._id, res);

    return res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken
    });
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired refresh token",
      error: err.message
    });
  }
};
