import { z } from 'zod'

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .nullable(),
  profileImageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .nullable(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
