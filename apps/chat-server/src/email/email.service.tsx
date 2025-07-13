import otpGenerator from 'otp-generator'
import { Inject, Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { DrizzleAsyncProvider, schema } from '~/drizzle'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import fs from 'node:fs'
import { render } from '@react-email/components'
import WelcomeEmail from 'emails/welcome'
import { renderEmailTemplate } from './emails'
import { EmailTemplate } from './email.types'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EmailService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
    private readonly config: ConfigService,
  ) {}

  private transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
    tls: {
      rejectUnauthorized: false, // optional
    },
  })
  async generateOTP({ user_id }: { user_id: string }) {
    try {
      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      })
      const expires_at = new Date(Date.now() + 60000 * 10) // Expires after 10 minutes
      // const otp = await this.db.

      // const tp = await prisma.otp.create({
      //   data: {
      //     user_id,
      //     otp: OTP,
      //     expires_at,
      //   },
      // })
      //
      // if (!tp) return { otp: null }
      //
      // return { otp: OTP }
    } catch (error) {
      return { otp: null }
    }
  }

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
