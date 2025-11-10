import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendMail, templates } from '../services/mail.js';

const router = express.Router();

/**
 * GET /api/users
 * Query:
 *  - q: termo de busca (name ou email)
 *  - page: página (1..n)
 *  - limit: itens por página (default 20)
 *
 * Agora: admin e volunteer podem listar.
 */
router.get('/', requireAuth, requireRole(['admin', 'volunteer']), async (req, res) => {
  const { q = '', page = 1, limit = 20 } = req.query;
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const filter = q
    ? { $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }] }
    : {};

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
    User.countDocuments(filter)
  ]);

  res.json({ items, page: p, limit: l, total, pages: Math.ceil(total / l) });
});

/** GET /api/users/:id - detalhes (admin e volunteer) */
router.get('/:id', requireAuth, requireRole(['admin', 'volunteer']), async (req, res) => {
  const item = await User.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Membro não encontrado' });
  res.json(item);
});

/** POST /api/users - criar (somente admin) */
router.post('/', requireAuth, requireRole(['admin']), async (req, res) => {
  const { name, email, password, role = 'member', birthDate, position } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'E-mail já cadastrado' });

  if (!password) return res.status(400).json({ error: 'Informe uma senha' });

  const toCreate = {
    name, email, role, birthDate, position,
    password: await bcrypt.hash(password, 10)
  };

  const u = await User.create(toCreate);

  try {
    if (u.role === 'volunteer') {
      const t = templates();
      const tpl = t.welcomeVolunteer(u.name);
      await sendMail({ to: u.email, subject: tpl.subject, html: tpl.html });
    }
  } catch (e) {
    console.error('Erro e-mail voluntário:', e.message);
  }

  res.status(201).json(u);
});

/** PUT /api/users/:id - atualizar (somente admin) */
router.put('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const { password, ...rest } = req.body;
  const patch = { ...rest };
  if (password) patch.password = await bcrypt.hash(password, 10);

  const updated = await User.findByIdAndUpdate(req.params.id, patch, { new: true });
  if (!updated) return res.status(404).json({ error: 'Membro não encontrado' });
  res.json(updated);
});

/** DELETE /api/users/:id - remover (somente admin) */
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const found = await User.findById(req.params.id);
  if (!found) return res.status(404).json({ error: 'Membro não encontrado' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
