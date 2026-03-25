const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "USER EXISTS ALREADY" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: "USER REGISTERED",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "SERVER ERROR", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "EMAIL OR PASSWORD INCORRECT" });
    }

    const correct = await user.isCorrectPassword(password);
    if (!correct) {
      res.status(400).json({ message: "EMAIL OR PASSWORD INCORRECT" });
    }

    const payload = {
      _id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({
      message: "LOGGED IN",
      token,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ message: "SERVER ERROR", error: error.message });
  }
});

module.exports = router;
