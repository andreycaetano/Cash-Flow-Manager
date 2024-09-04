// email.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `http://${process.env.URL_BASE}.com/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject: 'Recuperação de Senha',
            text: `Clique no link para resetar sua senha: ${resetLink}`,
            html: `<p>Clique no link para resetar sua senha: <a href="${resetLink}">${resetLink}</a></p>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return {
                response: info.response,
                envelope: info.envelope,
                messageId: info.messageId
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
