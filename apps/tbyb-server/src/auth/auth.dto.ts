import { z } from 'zod'
import { AuthMessageType } from './auth.types'

const errorMessage = <T extends AuthMessageType>(message: T) => ({ message })

export const signinSchema = z.object({
  username: z
    .string({ ...errorMessage('ZOD_EXPECTED_STRING') })
    .min(3, { ...errorMessage('ZOD_TOO_SHORT') })
    .max(30, { ...errorMessage('ZOD_TOO_LONG') }),
  password: z
    .string({ ...errorMessage('ZOD_EXPECTED_STRING') })
    .min(8, { ...errorMessage('ZOD_TOO_SHORT') })
    .max(30, { ...errorMessage('ZOD_TOO_LONG') }),
})
export type SignupSchemaType = z.infer<typeof signupSchema>

export const signupSchema = signinSchema.extend({
  email: z.string({ ...errorMessage('ZOD_EXPECTED_STRING') }).email({ ...errorMessage('ZOD_INVALID') }),
  name: z
    .string({ ...errorMessage('ZOD_EXPECTED_STRING') })
    .min(3, { ...errorMessage('ZOD_TOO_SHORT') })
    .max(30, { ...errorMessage('ZOD_TOO_LONG') }),
})
export type SigninSchemaType = z.infer<typeof signinSchema>

export const withIDSchema = z.object({
  user_id: z.string({ ...errorMessage('ZOD_EXPECTED_STRING') }),
})
export type WithIDSchemaType = z.infer<typeof withIDSchema>

export const forgotPasswordSchema = signupSchema.pick({ email: true })
export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = withIDSchema.merge(signupSchema.pick({ password: true }))
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>

export const updateAccountInformationSchema = withIDSchema.merge(signupSchema.partial())
export type UpdateAccountInformationSchemaType = z.infer<typeof updateAccountInformationSchema>

export const verifyCodeSchema = resetPasswordSchema.omit({ password: true }).extend({
  otp: z.string({ ...errorMessage('ZOD_EXPECTED_STRING') }).min(6, { ...errorMessage('ZOD_TOO_SHORT') }),
})
export type VerifyCodeSchemaType = z.infer<typeof verifyCodeSchema>
