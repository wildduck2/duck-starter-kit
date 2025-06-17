import z from 'zod'

export const signinSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  name: z.string(),
})
