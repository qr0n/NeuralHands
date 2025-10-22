import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";
import User from "../models/user.model.js";
import { createAccessToken, createRefreshToken } from "../middleware/jwt.js";

/**
 * Handles user registration.
 */
export const signupController = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    // Validate input fields
    if (!username || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long " });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match " });
    }

    // Check for existing email or username in parallel
    const foundEmail = await User.findOne({ email });
    const foundUsername = await User.findOne({ username });

    if (foundEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    if (foundUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    //  Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create and save user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Respond (omit password for security)
    return res.status(201).json({
      message: "User created successfully.",
      user: { username, email }
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

/**
 * Handles user login.
 */
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    // 2️⃣ Find user by email
    const foundUser = await User.findOne({ email }).lean();
    if (!foundUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Create tokens (access + refresh)
    await createAccessToken(foundUser._id, res);
    await createRefreshToken(foundUser._id, res);

    // 5️⃣ Respond success
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const googleAuthController = async (req, res) => {
  const { idToken } = req.body;

  try {
    if (!idToken) {
      return res.status(400).json({ message: "Missing Google ID token" });
    }

    // 1️⃣ Verify the ID token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 2️⃣ Find existing user or create new
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        password: "" // not needed for Google users
      });
    }

    // 3️⃣ Issue your own tokens
    await createAccessToken(user._id, res);
    await createRefreshToken(user._id, res);

    // 4️⃣ Return success
    return res.status(200).json({
      message: "Google login successful",
      user: { username: user.username, email: user.email, picture }
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({
      message: "Invalid Google token",
      error: error.message
    });
  }
};

/**
 * Handles user logout.
 */
export const logoutController = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // 1️⃣ Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(400)
      .json({ message: "Invalid token.", error: error.message });
  }
};
