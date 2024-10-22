import { z } from 'zod'

export const userSchema = z.object({
    username: z.string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),


})

export const eventSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title is too long"),
    description: z.string()
        .min(1, "Title is required")
        .max(500, "Title is too long"),
    duration: z.number()
        .int()
        .positive("Duration must be a positive number"),
    isPrivate: z.boolean(),

})