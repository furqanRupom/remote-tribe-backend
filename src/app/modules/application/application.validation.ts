import { z } from 'zod';

 const applicationCreateValidation = z.object({
    body: z.object({
        coverLetter: z.string().min(10, { message: 'Cover letter must be at least 10 characters long' }),
    })
});

export const ApplicationValidation = {applicationCreateValidation}