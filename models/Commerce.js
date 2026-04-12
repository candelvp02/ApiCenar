import mongoose from 'mongoose';

const commerceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    phone: { type: String, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    commerceTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommerceType', required: true },
    logo: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Commerce', commerceSchema);