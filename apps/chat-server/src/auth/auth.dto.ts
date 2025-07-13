import { z } from 'zod'
import { AuthErrorType } from './auth.types'

const errorMessage = <T extends AuthErrorType>(message: T) => ({ message })

export const signinSchema = z.object({
  username: z
    .string()
    .min(3, { ...errorMessage('ZOD_TOO_SHORT') })
    .max(30, { ...errorMessage('ZOD_TOO_LONG') }),
  password: z
    .string()
    .min(8, { ...errorMessage('ZOD_TOO_SHORT') })
    .max(30, { ...errorMessage('ZOD_TOO_LONG') }),
})

export const signupSchema = z.object({
  email: z.string().email({ ...errorMessage('ZOD_INVALID') }),
  username: z
    .string()
    .min(3, { ...errorMessage('ZOD_TOO_SHORT') })
    .max(30, { ...errorMessage('ZOD_TOO_LONG') }),
  password: z
    .string()
    .min(8, { ...errorMessage('ZOD_TOO_SHORT') })
    .max(30, { ...errorMessage('ZOD_TOO_LONG') }),
})
