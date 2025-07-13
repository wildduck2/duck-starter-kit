import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { AuthError } from './auth.constants'
import { signinSchema, signupSchema } from './auth.dto'

// SCHEMAAs types
export type SigninSchemaType = z.infer<typeof signinSchema>
export type SignupSchemaType = z.infer<typeof signupSchema>

export type AuthErrorType = (typeof AuthError)[number]

// DTOS TYPES
// Why these are here?
// well this clear because when i import the schemas in the client `Ts` parse these files and
// compiles them and throws errors of missing packages
export class SigninDto extends createZodDto(signinSchema) {}
export class SignupDto extends createZodDto(signupSchema) {}
