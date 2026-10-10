const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Helper to sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
      }

      // Create new user (password is hashed by pre-save hook)
      const user = await User.create({ name, email, password, phone: phone || '' });

      return res.status(201).json({
        message: 'Account created successfully! Please log in.',
        user: user.toSafeObject(),
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
  }
);

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user and include password field (excluded by default)
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = signToken(user._id);

      return res.json({
        message: 'Login successful!',
        token,
        user: user.toSafeObject(),
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Login failed. Please try again.' });
    }
  }
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: user.toSafeObject() });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Could not fetch profile.' });
  }
});

// ─── PUT /api/auth/profile ───────────────────────────────────────────────────
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be blank').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('state').optional().trim(),
    body('pincode').optional().trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, phone, address, city, state, pincode } = req.body;

      // Prevent email conflict with another user
      if (email && email !== req.user.email) {
        const existing = await User.findOne({ email });
        if (existing) {
          return res.status(400).json({ message: 'This email is already in use by another account.' });
        }
      }

      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (email !== undefined) updateFields.email = email;
      if (phone !== undefined) updateFields.phone = phone;
      if (address !== undefined) updateFields.address = address;
      if (city !== undefined) updateFields.city = city;
      if (state !== undefined) updateFields.state = state;
      if (pincode !== undefined) updateFields.pincode = pincode;

      const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
        new: true,
        runValidators: true,
      });

      return res.json({ message: 'Profile updated successfully!', user: updatedUser.toSafeObject() });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ message: 'Could not update profile.' });
    }
  }
);

module.exports = router;
