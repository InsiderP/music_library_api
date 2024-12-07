import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemType: {
    type: String,
    enum: ['Artist', 'Album', 'Track'],
    required: true,
  }
}, { timestamps: true });

// Compound index to prevent duplicate favorites
FavoriteSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);