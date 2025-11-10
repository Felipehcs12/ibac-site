import cron from 'node-cron';
import User from '../models/User.js';
import { sendMail, templates } from '../services/mail.js';

// Roda todo dia às 08:00 (America/Sao_Paulo)
export function startBirthdayJob() {
  cron.schedule(
    '0 8 * * *',
    async () => {
      try {
        const today = new Date();
        const mm = today.getMonth() + 1;
        const dd = today.getDate();

        const users = await User.find({ birthDate: { $exists: true } });
        const t = templates();

        for (const u of users) {
          if (!u.birthDate) continue;
          const bd = new Date(u.birthDate);
          if ((bd.getMonth() + 1) === mm && bd.getDate() === dd) {
            const tpl = t.happyBirthday(u.name);
            await sendMail({ to: u.email, subject: tpl.subject, html: tpl.html });
          }
        }
        console.log('🎂 Verificação de aniversários concluída');
      } catch (e) {
        console.error('Erro no job de aniversários:', e);
      }
    },
    { timezone: 'America/Sao_Paulo' }
  );
}
