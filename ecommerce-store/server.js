const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// =====================
// DATABASE CONNECTION
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ Database connection failed:', err));

// =====================
// TEST ROUTE
// =====================
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);
app.get('/', (req, res) => {
  res.send('🚀 E-Commerce Server is Running!');
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
