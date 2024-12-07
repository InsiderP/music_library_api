import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Track || mongoose.model('Track', TrackSchema);