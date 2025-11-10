import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['member', 'volunteer', 'admin'], default: 'member' },
    position: { type: String, default: '' },       // ex.: "1º Secretário"
    birthDate:{ type: Date }                       // para e-mails de aniversário
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
