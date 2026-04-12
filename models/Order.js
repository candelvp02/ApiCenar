import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commerceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', required: true },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    status: { type: String, enum: ['Pending', 'InProgress', 'Completed'], default: 'Pending' },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    itbisPercentage: { type: Number, required: true },
    itbisAmount: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);