const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all students
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin adds a student
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, standard, rollNumber, contact, email } = req.body;
  try {
    const exists = await Student.findOne({ rollNumber });
    if (exists) return res.status(400).json({ message: 'Roll number already exists' });

    const student = await Student.create({ name, standard, rollNumber, contact, email });

    // Auto-create user account for student
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rollNumber, salt); // Default password: rollNumber

    await User.create({
      username: rollNumber.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      studentId: student._id
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete student
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      await User.deleteMany({ studentId: student._id });
      await student.deleteOne();
      res.json({ message: 'Student and associated user account removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
