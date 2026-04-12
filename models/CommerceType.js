import mongoose from 'mongoose';

const commerceTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    icon: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('CommerceType', commerceTypeSchema);