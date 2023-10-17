import { z } from 'zod'

export const envSchema = z.object({
  VERSION: z.coerce.string().optional().default('v1'),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
})

export type Env = z.infer<typeof envSchema>
