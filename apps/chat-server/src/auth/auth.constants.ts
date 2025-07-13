import { ZodError } from '~/common/constants'

export const AuthError = [
  // NOTE: AUTH_ERROR
  'INVALID_CREDENTIALS',
  'UNAUTHORIZED',
  'USERNAME_INVALID',
  'PASSWORD_INVALID',

  'REGISTRATION_FAILED',
  'SIGNIN_FAILED',
  'SIGNOUT_FAILED',
  ...ZodError,
] as const
