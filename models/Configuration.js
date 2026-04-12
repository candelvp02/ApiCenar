import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String, required: true },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Configuration', configurationSchema);