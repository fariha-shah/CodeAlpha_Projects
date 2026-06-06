const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: 'card' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
