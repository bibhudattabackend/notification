const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = {
  // ✅ Register User
  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      // Create a new user (bcrypt hashing is handled in the User model hook)
      await User.create({ username, password });

      res.redirect("/login");
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).send("Registration failed");
    }
  },

  // ✅ Login User
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await User.findOne({ where: { username } });
      if (!user) return res.redirect("/login?error=User not found");

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.redirect("/login?error=Invalid password");

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set auth token in HTTP-only cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.redirect("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).send("Login failed");
    }
  },
};
