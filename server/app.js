const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./src/config/mongo.config.js');
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');
dotenv.config();

app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});