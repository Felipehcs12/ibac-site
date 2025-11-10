import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendMail, templates } from '../services/mail.js';

const router = express.Router();

// Registro (membro por padrão) + boas-vindas
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'E-mail já cadastrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, birthDate });

    // e-mail de boas-vindas
    try {
      const t = templates();
      const tpl = t.welcomeMember(user.name);
      await sendMail({ to: user.email, subject: tpl.subject, html: tpl.html });
    } catch (e) {
      console.error('Erro enviando e-mail de boas-vindas:', e.message);
    }

    return res.json({ ok: true, id: user._id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ error: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: u._id, role: u.role, name: u.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// (Opcional) Promover um usuário a admin - proteja isso melhor em produção
router.post('/make-admin', requireAuth, requireRole(['admin']), async (req, res) => {
  const { email } = req.body;
  const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
  return res.json({ ok: true, user });
});

export default router;
