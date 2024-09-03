// routes/userRoutes.js

import express from "express";
import { createUser, getUserById, getAllUsers, updateUser, deleteUser } from "../services/userServices.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { username, name, password, role } = req.body;

    // Validasi input
    if (!username || !name || !password) {
      return res.status(400).json({ message: "Username, name, and password are required" });
    }

    // Enkripsi kata sandi
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat data pengguna dengan password yang terenkripsi
    const userData = {
      username,
      name,
      password: hashedPassword,
      role,
    };

    // Buat pengguna baru
    const newUser = await createUser(userData);

    // Kirim respons dengan data pengguna baru
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Update a user by ID
router.patch("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const updateData = req.body;
    const updatedUser = await updateUser(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
