import { z } from 'zod';

/**
 * Common zod schemas shared between apps/api (request validation) and
 * apps/web (form validation). Kept minimal in Phase 1 — no business rules.
 */

export const emailSchema = z.string().email();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const idSchema = z.string().uuid();

export type PaginationInput = z.infer<typeof paginationSchema>;
