import mongoose from 'mongoose';

const HydrationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'user123' // Sementara gunakan default value
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  collection: 'hydration-logs'
});

export default mongoose.model('Hydration', HydrationSchema);