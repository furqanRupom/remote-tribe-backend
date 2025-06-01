import z from "zod"

const userUpdateValidation = z.object({
    body:z.object({
        name:z
        .string({required_error:'Name is required'})
        .min(2,'Name must be at least 2 characters long')
        .optional(),
        email:z
        .string({required_error:'Email is required'})
        .email('Invalid email format').optional(),
       address:z
        .string({message:'Enter a valid address'}).optional(),
       phone:z.string({message:'Enter a valid phone number'}).optional()
    })
})

export const UserValidation = {userUpdateValidation}