import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

// jobs
import { startBirthdayJob } from './jobs/birthdays.js';

// rotas
import authRoutes from './routes/auth.js';
import noticeRoutes from './routes/notice.js';
import eventRoutes from './routes/event.js';
import scheduleRoutes from './routes/schedule.js';
import userRoutes from './routes/user.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// montar rotas
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/users', userRoutes);

// conectar ao Mongo e iniciar servidor
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ibac';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor IBAC rodando na porta ${PORT}`);
      // iniciar job diário de aniversários (08:00 America/Sao_Paulo)
      startBirthdayJob();
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });

// tratamento de erro global (fallback)
app.use((err, req, res, _next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});
