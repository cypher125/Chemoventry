import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

// Derive the TypeScript type from the schema
export type LoginSchemaType = z.infer<typeof loginSchema>;
