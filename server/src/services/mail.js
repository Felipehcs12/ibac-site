import nodemailer from 'nodemailer';

const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  FROM_NAME, FROM_EMAIL,
  SECRETARY_NAME, SECRETARY_EMAIL
} = process.env;

if (!SMTP_HOST || !SMTP_PORT) {
  console.warn('⚠️  SMTP não configurado (.env). E-mails não serão enviados.');
}

let transporter;
try {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  });
} catch (e) {
  console.error('Erro ao configurar transporte SMTP:', e.message);
}

export async function sendMail({ to, subject, html, text }) {
  if (!transporter) return { ok: false, skipped: true };
  const info = await transporter.sendMail({
    from: { name: FROM_NAME || 'IBAC', address: FROM_EMAIL || 'no-reply@ibac.org' },
    to, subject, text, html
  });
  return { ok: true, messageId: info.messageId };
}

export function templates() {
  const secretary = SECRETARY_NAME || 'Secretaria';
  return {
    welcomeMember: (name) => ({
      subject: 'Seja bem-vindo(a) à IBAC!',
      html: `
        <p>Olá, <strong>${name}</strong>!</p>
        <p>Seja muito bem-vindo(a) à nossa comunidade. Estamos felizes com sua presença.</p>
        <p>Conte conosco no que precisar.</p>
        <p>Atenciosamente,<br>${secretary}</p>
      `
    }),

    happyBirthday: (name) => ({
      subject: 'Feliz aniversário! 🎉',
      html: `
        <p>Parabéns, <strong>${name}</strong>!</p>
        <p>Que Deus abençoe seu novo ciclo com paz e alegria.</p>
        <p>Com carinho,<br>${secretary}</p>
      `
    }),

    welcomeVolunteer: (name) => ({
      subject: 'Cadastro de voluntário confirmado',
      html: `
        <p>Olá, <strong>${name}</strong>!</p>
        <p>Seu cadastro como <em>voluntário</em> foi concluído. Você já pode acessar a intranet.</p>
        <p>Obrigado por servir!</p>
        <p>${secretary}</p>
      `
    }),

    scheduledVolunteer: (name, sched) => ({
      subject: `Você foi escalado(a): ${sched.name} (${new Date(sched.date).toLocaleDateString()})`,
      html: `
        <p>Olá, <strong>${name}</strong>!</p>
        <p>Você foi escalado(a) para <strong>${sched.name}</strong> em ${new Date(sched.date).toLocaleString()}.</p>
        ${sched.notes ? `<p><strong>Notas:</strong> ${sched.notes}</p>` : ''}
        <p>Por favor, confirme sua presença pela intranet.</p>
        <p>${secretary}</p>
      `
    }),

    confirmationToVolunteer: (name, sched, status) => ({
      subject: `Confirmação registrada: ${status === 'confirmed' ? 'Presença' : 'Indisponibilidade'}`,
      html: `
        <p>Olá, <strong>${name}</strong>!</p>
        <p>Sua ${status === 'confirmed' ? 'confirmação de presença' : 'indisponibilidade'} para <strong>${sched.name}</strong> em ${new Date(sched.date).toLocaleString()} foi registrada.</p>
        <p>${secretary}</p>
      `
    }),

    notifySecretary: (memberName, sched, status) => ({
      subject: `[Intranet] ${memberName} ${status === 'confirmed' ? 'confirmou presença' : 'marcou indisponibilidade'}`,
      html: `
        <p>${memberName} ${status === 'confirmed' ? 'CONFIRMOU PRESENÇA' : 'ADICIONOU INDISPONIBILIDADE'}.</p>
        <ul>
          <li>Escala: <strong>${sched.name}</strong></li>
          <li>Data: ${new Date(sched.date).toLocaleString()}</li>
          <li>Status: ${status}</li>
        </ul>
      `,
      to: SECRETARY_EMAIL
    })
  };
}
