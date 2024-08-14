import { z } from 'zod';

export const deleteSchema = z.object({ id: z.number() });

export type DeleteSchema = typeof deleteSchema;
