
import { z } from 'zod';

const userRegistrationValidation = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format'),

        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

        name: z
            .string({ required_error: 'Name is required' })
            .min(2, 'Name must be at least 2 characters long'),
    }),
});

export const AuthValidation = { userRegistrationValidation };