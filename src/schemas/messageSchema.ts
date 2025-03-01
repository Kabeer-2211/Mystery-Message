import { z } from 'zod';

export const MessageSchema = z.object({
    content: z
        .string()
        .min(10, 'message must be at least of 10 characters')
        .max(300, 'message must be no longer than 300 characters'),
});
