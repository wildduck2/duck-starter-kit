import { z } from 'zod'
import { AuthErrorType } from './auth.types'
import { createZodDto } from 'nestjs-zod'

const errorMessage = <T extends AuthErrorType>(message: T) => ({ message })

export const signinSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const signupSchema = z.object({
  email: z.string().email({ ...errorMessage('EMAIL_INVALID') }),
  username: z
    .string()
    .min(3, { ...errorMessage('USERNAME_TOO_SHORT') })
    .max(30, { ...errorMessage('USERNAME_TOO_LONG') }),
  password: z.string().min(8, { ...errorMessage('PASSWORD_TOO_SHORT') }),
  name: z.string({ ...errorMessage('NAME_INVALID') }),
})

export class SigninDto extends createZodDto(signinSchema) {}
export class SignupDto extends createZodDto(signupSchema) {}
