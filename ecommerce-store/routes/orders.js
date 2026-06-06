const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

// ===== MIDDLEWARE: Verify Token =====
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token)
    return res.status(401).json({ message: 'Access denied. Please login.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: 'Invalid or expired token. Please login again.' });
  }
}

// ===== PLACE ORDER =====
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalPrice, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order.' });
    }

    const newOrder = new Order({
      user: req.user.userId,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      address,
      paymentMethod: paymentMethod || 'card',
      status: 'pending',
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId: savedOrder._id,
    });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ===== GET MY ORDERS =====
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
