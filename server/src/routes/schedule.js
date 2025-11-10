import express from 'express';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendMail, templates } from '../services/mail.js';

const router = express.Router();

// listar escalas (público)
router.get('/', async (_req, res) => {
  const items = await Schedule.find().sort({ date: 1 });
  res.json(items);
});

// util: resolve destinatários a partir de nomes/emails
async function resolveRecipients(team) {
  const names = (team || []).filter(Boolean);
  const emails = new Set();
  for (const t of names) {
    if (/.+@.+\..+/.test(t)) emails.add(t.toLowerCase());
  }
  const found = await User.find({ name: { $in: names } });
  for (const u of found) emails.add(u.email.toLowerCase());
  return Array.from(emails);
}

// criar escala (volunteer/admin) => dispara e-mail aos escalados
router.post('/', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  const created = await Schedule.create(req.body);

  try {
    const t = templates();
    const recipients = await resolveRecipients(created.team);
    for (const email of recipients) {
      const user = await User.findOne({ email });
      const name = user?.name || email;
      const tpl = t.scheduledVolunteer(name, created);
      await sendMail({ to: email, subject: tpl.subject, html: tpl.html });
    }
  } catch (e) {
    console.error('Erro enviando e-mails de escala:', e.message);
  }

  res.json(created);
});

// atualizar escala
router.put('/:id', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// deletar escala
router.delete('/:id', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// voluntário confirma presença ou marca indisponibilidade
router.post('/:id/respond', requireAuth, requireRole(['member', 'volunteer', 'admin']), async (req, res) => {
  const { status } = req.body; // 'confirmed' | 'unavailable'
  const userId = req.user.id;

  if (!['confirmed', 'unavailable'].includes(status)) {
    return res.status(400).json({ error: 'status inválido' });
  }

  const sched = await Schedule.findById(req.params.id);
  if (!sched) return res.status(404).json({ error: 'Escala não encontrada' });

  sched.responses.push({ user: userId, status });
  await sched.save();

  try {
    const t = templates();
    const user = await User.findById(userId);

    // e-mail para o voluntário (confirmação)
    const tplMe = t.confirmationToVolunteer(user.name, sched, status);
    await sendMail({ to: user.email, subject: tplMe.subject, html: tplMe.html });

    // e-mail para o 1º secretário (notificação)
    const tplSec = t.notifySecretary(user.name, sched, status);
    await sendMail({ to: process.env.SECRETARY_EMAIL, subject: tplSec.subject, html: tplSec.html });
  } catch (e) {
    console.error('Erro enviando confirmações:', e.message);
  }

  res.json({ ok: true });
});

export default router;
