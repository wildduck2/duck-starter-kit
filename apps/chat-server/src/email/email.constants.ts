import { registerAs } from '@nestjs/config'
import { MailerOptions } from '@nestjs-modules/mailer'

export default registerAs('mailer', (): MailerOptions => {
  return {
    transport: {
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: Number.parseInt(process.env.MAIL_PORT as string, 10),
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    defaults: {
      from: {
        name: process.env.MAIL_FROM_NAME as string,
        address: process.env.MAIL_FROM_ADDRESS as string,
      },
    },
  }
})

export const TemplateText = {
  welcome: {
    subject: 'Welcome to acme',
    text: "Thanks for joining acme! We're excited to have you on board. Get started with our powerful tools and unlock the full potential of your business.",
  },
  confirm_email: {
    subject: 'Verify your email address',
    text: "Thanks for starting the new acme account creation process. We want to make sure it's really you. Please enter the following verification code when prompted.",
  },
  waitlist: {
    subject: 'Thanks for Your interest in acme',
    text: 'Thanks for Your interest in acme! We received your information and we will be in touch soon',
  },
}
