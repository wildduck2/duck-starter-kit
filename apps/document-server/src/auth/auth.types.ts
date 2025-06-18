import z from 'zod'
import { signinSchema, signupSchema } from './auth.dto'
import { AuthError } from './auth.constants'
import { createZodDto } from 'nestjs-zod'

// NOTE: SCHEMAAs types
export type SigninSchemaType = z.infer<typeof signinSchema>
export type SignupSchemaType = z.infer<typeof signupSchema>

export type AuthErrorType = (typeof AuthError)[number]

// NOTE: DTOS TYPES
// NOTE: Why these are here?
// well this clear because when i import the schemas in the client `Ts` parse these files and
// compiles them and throws errors of missing packages
export default class SigninDto extends createZodDto(signinSchema) {}
export class SignupDto extends createZodDto(signupSchema) {}
