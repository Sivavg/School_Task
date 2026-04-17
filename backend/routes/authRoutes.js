const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ message: 'User record not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        studentId: user.studentId,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' })
      });
    } else {
      // Very clear message for debugging
      res.status(401).json({ message: 'Invalid password. If this is admin, please wait for server to restart.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Self-Register (Student)
router.post('/register', async (req, res) => {
  const { username, password, name, standard, rollNumber } = req.body;
  try {
    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Username already taken' });

    const student = await Student.create({ name, standard, rollNumber });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      studentId: student._id
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      studentId: user.studentId,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
