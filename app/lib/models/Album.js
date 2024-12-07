import mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Album || mongoose.model('Album', AlbumSchema);