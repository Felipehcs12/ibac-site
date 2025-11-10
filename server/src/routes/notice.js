import express from 'express';
import Notice from '../models/Notice.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// públicas
router.get('/', async (_req, res) => {
  const items = await Notice.find().sort({ createdAt: -1 }).limit(20);
  res.json(items);
});

// protegidas
router.post('/', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  const created = await Notice.create(req.body);
  res.json(created);
});

router.put('/:id', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireRole(['volunteer', 'admin']), async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
