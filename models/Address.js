import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    sector: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    reference: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Address', addressSchema);