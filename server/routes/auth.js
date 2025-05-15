const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, ActivityLog } = require('../models');
const { Op } = require('sequelize');

// Middleware to log activity
const logActivity = async (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    res.locals.data = data;
    originalSend.apply(res, arguments);
  };

  next();
};

// Register new user
router.post('/register', logActivity, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('Registration attempt:', { username, email });
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      console.log('User already exists:', { email, username });
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: 'user' // Default role
    });

    console.log('User created successfully:', { id: user.id, username: user.username });

    // Log the activity
    await ActivityLog.create({
      userId: user.id,
      action: 'CREATE',
      entityType: 'USER',
      entityId: user.id,
      details: { action: 'REGISTER' }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login user
router.post('/login', logActivity, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login successful:', { id: user.id, username: user.username });

    // Log the activity
    await ActivityLog.create({
      userId: user.id,
      action: 'READ',
      entityType: 'USER',
      entityId: user.id,
      details: { action: 'LOGIN' }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router; 