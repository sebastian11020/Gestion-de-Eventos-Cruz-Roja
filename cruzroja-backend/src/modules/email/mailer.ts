import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'pharmatrack01@gmail.com',
    pass: 'hnei nvtj hhcb eygq',
  },
});

transporter
  .verify()
  .then(() => console.log('Servidor SMTP listo para enviar correos'))
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('No se pudo conectar al servidor SMTP:', err.message);
    } else {
      console.error('No se pudo conectar al servidor SMTP:', String(err));
    }
  });
