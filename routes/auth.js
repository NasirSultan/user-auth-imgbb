const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// REGISTER
router.post("/register", upload.single("file"), async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.file;

  if (!name || !email || !password || !file) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload file to Imgbb
    const imagePath = path.resolve(file.path);
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("key", process.env.IMGBB_API_KEY);

    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(imagePath); // delete temp

    const user = new User({
      name,
      email,
      password: hashedPassword,
      imageUrl: response.data.data.url,
    });

    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    },
  });
});

// PROTECTED: Get profile (example usage of JWT)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
