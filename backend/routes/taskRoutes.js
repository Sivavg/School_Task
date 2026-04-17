const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

// @desc    Get tasks (filter if student — only their own tasks)
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'student') {
      filter = { studentId: req.user.studentId };
    }
    const tasks = await Task.find(filter)
      .populate('studentId', 'name rollNumber standard section')
      .sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new task (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { title, description, subject, priority, studentId, dueDate } = req.body;
    if (!title || !studentId || !dueDate || !subject) {
      return res.status(400).json({ message: 'Title, subject, student, and due date are required.' });
    }
    const task = new Task({ title, description, subject, priority, studentId, dueDate });
    const created = await task.save();
    const populated = await Task.findById(created._id).populate('studentId', 'name rollNumber standard section');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update task (toggle complete or edit — admin can edit all, student can only toggle their own)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'student') {
      if (task.studentId.toString() !== req.user.studentId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Students can only toggle completion
      task.isCompleted = req.body.isCompleted ?? task.isCompleted;
      task.completedAt = task.isCompleted ? new Date() : undefined;
    } else {
      // Admin can update everything
      task.title       = req.body.title       ?? task.title;
      task.description = req.body.description ?? task.description;
      task.subject     = req.body.subject     ?? task.subject;
      task.priority    = req.body.priority    ?? task.priority;
      task.dueDate     = req.body.dueDate     ?? task.dueDate;
      task.studentId   = req.body.studentId   ?? task.studentId;
      task.isCompleted = req.body.isCompleted ?? task.isCompleted;
      task.completedAt = task.isCompleted ? (task.completedAt || new Date()) : undefined;
    }

    const updated = await task.save();
    const populated = await Task.findById(updated._id).populate('studentId', 'name rollNumber standard section');
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete task (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
