import { z } from 'zod'

export const envSchema = z.object({
  JWT_SECRET: z.string().optional().default('grabngo'),
  VERSION: z.coerce.string().optional().default('v1'),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
})

export type Env = z.infer<typeof envSchema>
