import User from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * Updates a user's profile information.
 */
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (!username && !email && !password) {
      return res.status(400).json({ message: "No update fields provided." });
    }

    // 2️⃣ Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Check if username or email already exists (if changed)
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email }).lean();
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already in use." });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username }).lean();
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already in use" });
      }
      user.username = username;
    }

    // 4️⃣ If password provided, hash securely
    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // 5️⃣ Save only if changes occurred
    const updatedUser = await user.save();

    // 6️⃣ Remove password before sending response
    const { password: _, ...safeUser } = updatedUser.toObject();

    // 7️⃣ Return success response
    return res.status(200).json({
      message: "User profile updated successfully",
      user: safeUser
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
