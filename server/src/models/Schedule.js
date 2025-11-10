import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true }, // Ex.: "Culto de Domingo"
    date:  { type: Date, required: true },
    team:  [{ type: String }],               // nomes ou e-mails
    notes: { type: String },
    responses: [
      {
        user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['confirmed', 'unavailable'] },
        at:     { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Schedule', scheduleSchema);
