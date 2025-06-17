import z from 'zod'
import { signinSchema, signupSchema } from './auth.dto'
import { AuthError } from './auth.constants'

// NOTE: SCHEMAAs types
export type SigninSchemaType = z.infer<typeof signinSchema>
export type SignupSchemaType = z.infer<typeof signupSchema>

export type AuthErrorType = (typeof AuthError)[number]
