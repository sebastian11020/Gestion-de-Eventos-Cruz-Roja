import { Injectable } from '@nestjs/common';
import { SendEmail } from './dto/send-email.dto';
import { transporter } from './mailer';
import { register } from './template/template';

@Injectable()
export class EmailService {
  async sendEmailRegister(info: SendEmail) {
    await transporter.sendMail({
      from: '"Registro de voluntario" <register@gmail.com>',
      to: info.email,
      subject: 'Registro de usuario',
      html: register(info.email, info.password),
    });
  }
}
