const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// Comprehensive CORS for Production
app.use(cors({
  origin: '*', // Temporarily allow all for deployment debugging, we can restrict later
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);

// Smart-Bootstrap Admin (Upsert logic)
const bootstrapAdmin = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Use findOneAndUpdate with upsert: true to ensure admin/admin123 ALWAYS exists and is correct
    await User.findOneAndUpdate(
      { username: 'admin' }, 
      { 
        username: 'admin',
        password: hashedPassword,
        role: 'admin' 
      }, 
      { upsert: true, new: true }
    );
    console.log('✅ System verified: Admin account active (admin / admin123)');
  } catch (err) {
    console.error('Bootstrap error:', err);
  }
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    bootstrapAdmin();
  })
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
