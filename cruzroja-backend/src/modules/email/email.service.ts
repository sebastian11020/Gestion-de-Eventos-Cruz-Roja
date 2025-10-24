import { Injectable } from '@nestjs/common';
import { transporter } from './mailer';
import { register } from './template/template-register';
import { SendEmailRegister } from './dto/send-email.dto';
import { GetEventCardDDto } from '../event/dto/get-event.dto';
import { TemplateNewEvent } from './template/template-new-event';

@Injectable()
export class EmailService {
  async sendEmailRegister(info: SendEmailRegister) {
    await transporter.sendMail({
      from: '"Registro de voluntario" <register@gmail.com>',
      to: info.email,
      subject: 'Registro de usuario',
      html: register(info.email, info.password),
    });
  }
  async sendEmailNewEventMany(emails: string[], event: GetEventCardDDto) {
    if (!emails.length) return;

    await transporter.sendMail({
      from: '"Notificación de nuevo evento" <register@gmail.com>',
      to: '"Voluntarios Cruz Roja" <no-reply@cruzroja.org>', // visible
      bcc: emails.join(','), // 🔒 todos los destinatarios ocultos entre sí
      subject: 'Notificación de nuevo evento',
      html: TemplateNewEvent(event),
    });
  }
}
