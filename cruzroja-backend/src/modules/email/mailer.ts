import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: 'pharmatrack01@gmail.com',
    pass: 'hnei nvtj hhcb eygq',
  },
});

transporter.verify().then(() => {
  console.log('Ready for send emails');
});
