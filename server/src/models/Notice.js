import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    body:        { type: String, required: true },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Notice', noticeSchema);
