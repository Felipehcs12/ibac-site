import express from 'express';
import Event from '../models/Event.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// públicas
router.get('/', async (_req, res) => {
  const items = await Event.find().sort({ date: 1 });
  res.json(items);
});

// protegidas
router.post('/', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  const created = await Event.create(req.body);
  res.json(created);
});

router.put('/:id', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
