import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected: ${process.env.DB_NAME}');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};