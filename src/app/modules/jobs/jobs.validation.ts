import { z } from 'zod'

 const jobCreateValidation = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Job title is required',
        }).min(3, { message: 'Title must be at least 3 characters long' }),

        description: z.string({
            required_error: 'Job description is required',
        }).min(10, { message: 'Description must be at least 10 characters long' }),

        companyName: z.string({
            required_error: 'Company name is required',
        }).min(2, { message: 'Company name must be at least 2 characters long' }),

        companyLogo: z
            .string()
            .url({ message: 'Company logo must be a valid URL' })
            .optional()
            .or(z.literal('')),

        location: z.string({
            required_error: 'Location is required',
        }).min(2, { message: 'Location must be at least 2 characters long' }),

        tags: z.array(z.string().min(1, { message: 'Tag cannot be empty' }), {
            required_error: 'At least one tag is required',
            invalid_type_error: 'Tags must be an array of strings',
        }).min(1, { message: 'At least one tag must be provided' }),

        type: z.string({
            required_error: 'Job type is required',
        }),

        salaryRange: z.string({
            required_error: 'Salary range is required',
        }),

        isRemote: z.boolean({
            required_error: 'isRemote must be true or false',
            invalid_type_error: 'isRemote must be a boolean value',
        }),
    })
})
const jobUpdateValidation = z.object({
    body: z.object({
        title: z.string({
            message: 'Enter a valid title for the job.',
        }).min(3, { message: 'Title must be at least 3 characters long' }).optional(),

        description: z.string({
            message: 'Provide a description for the job',
        }).min(10, { message: 'Description must be at least 10 characters long' }).optional(),

        companyName: z.string().min(2, { message: 'Company name must be at least 2 characters long' }).optional(),

        companyLogo: z
            .string()
            .url({ message: 'Company logo must be a valid URL' })
            .optional()
            .or(z.literal('')),

        location: z.string().min(2, { message: 'Location must be at least 2 characters long' }).optional(),

        tags: z.array(z.string().min(1, { message: 'Tag cannot be empty' }), {
            invalid_type_error: 'Tags must be an array of strings',
        }).min(1, { message: 'At least one tag must be provided' }).optional(),

        type: z.string({
            message: 'Enter a valid type for the job.',
        }).optional(),

        salaryRange: z.string({
            required_error: 'Enter a valid salary range for the job.',
        }).optional(),

        isRemote: z.boolean({
            invalid_type_error: 'isRemote must be a boolean value',
        }).optional(),
    })
})

export const JobValidation = { jobCreateValidation,jobUpdateValidation }