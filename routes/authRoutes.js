const express = require("express");
const admin = require("../firebase");

const router = express.Router();
const firebaseAuth = admin.auth();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication routes
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await firebaseAuth.getUserByEmail(email);
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await firebaseAuth.createUser({ email, password });

    // ✅ If user creation is successful, return success response
    return res.status(201).json({ message: "User registered successfully", userRecord });

  } catch (error) {
    console.error("Firebase Error:", error); // Log the exact Firebase error

    // ✅ Return the actual Firebase error message instead of a generic one
    return res.status(400).json({ error: error.message || "Registration failed" });
  }
});


module.exports = router;
