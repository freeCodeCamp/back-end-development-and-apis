
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findByUsername } from "../utils/db.js";

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "family-movie-watchlist-secret";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required."
    });
  }

  // Find user by username
  const user = findByUsername(username);

  if (!user) {
    return res.status(401).json({
      error: "Invalid username or password."
    });
  }

  // Compare password with stored bcrypt hash
  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({
      error: "Invalid username or password."
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    token
  });
});

export default router;
