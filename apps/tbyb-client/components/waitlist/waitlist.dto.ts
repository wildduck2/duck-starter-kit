import { z } from 'zod'

export const waitlistFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
})
export type WaitlistFormSchemaType = z.infer<typeof waitlistFormSchema>
