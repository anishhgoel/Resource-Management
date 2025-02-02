import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'secretkey';

// to register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // basic check to make sure all fields are there
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all the required fields" });
    }

    // checking if user already exists
    let user = await User.findOne({email});
    if (user) return res.status(400).json({ msg: "User already exists" });

    //generating salt and then hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //creating the user
    user = new User({
      name,
      email,
      password: hash,
      role: role || 'client'
    });

    //saving the user
    await user.save();
    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Error in registering:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

//  user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic check for email and password
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all required fields" });

    //checking if user with email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email does not exist" });

    // hashing the entered password and checking against hashed password stored in db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    
    //making payload
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    //generating token
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ msg: 'Server error', err: err.msg });
  }
});

export default router;