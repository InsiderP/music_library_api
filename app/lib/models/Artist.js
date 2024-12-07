import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grammy: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);