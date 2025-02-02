import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// GET current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // don't want to show the password for security reasons
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("Error retrieving profile:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update current user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      updatedFields.password = hash;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE current user profile
router.delete('/profile', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// admin endpoints as admin is the ultimate controller 

// GET all users (admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update a specific user by ID (admin only)
router.put('/:userId', auth, authorize(['admin']), async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (role) updatedFields.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      updatedFields.password = hash;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updatedFields },
      { new: true }
    ).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a specific user by ID (admin only)
router.delete('/:userId', auth, authorize(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;