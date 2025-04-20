import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/counterapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema for User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// POST route to add name and contact number
app.post('/users', async (req, res) => {
  const { name, contactNumber } = req.body;

  if (!name || !contactNumber) {
    return res.status(400).json({ error: 'Name and contact number are required' });
  }

  try {
    const user = new User({ name, contactNumber });
    await user.save();
    res.status(201).json({ message: 'User added successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user', details: error.message });
  }
});

// GET route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// ✅ GET route to get total user count
app.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user count', details: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server chal raha hai at http://localhost:${port}`);
});
