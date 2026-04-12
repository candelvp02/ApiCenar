import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    commerceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);