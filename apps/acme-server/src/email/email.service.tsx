import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { EmailTemplate } from './email.types'
import { renderEmailTemplate } from './emails'

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}

  private transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  })

  async sendTestEmail({
    from = this.config.get('MAIL_FROM_ADDRESS'),
    to,
    subject,
    text,
    template,
  }: {
    from?: string
    to: string
    subject: string
    text: string
    template: EmailTemplate
  }) {
    const html = await renderEmailTemplate(template.name, template.args)
    await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html,
    })
  }
}
