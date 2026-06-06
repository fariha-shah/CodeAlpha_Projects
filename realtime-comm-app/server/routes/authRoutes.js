const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Protected test route
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'You are authenticated ✅', user: req.user });
});

module.exports = router;
