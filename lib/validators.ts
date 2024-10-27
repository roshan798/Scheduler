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

export const daysSchema = z.object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
}).refine((data) => {
    if (data.isAvailable) {
        if (data.startTime && data.endTime) {
            return data.startTime < data.endTime
        }
        return true;
    }
    return true
},
    {
        message: "End time must be more than start time",
        path: ["endTime"]
    })

export const availabilitySchema = z.object({
    monday: daysSchema,
    tuesday: daysSchema,
    wednesday: daysSchema,
    thursday: daysSchema,
    friday: daysSchema,
    saturday: daysSchema,
    sunday: daysSchema,
    timeGap: z.number().min(0, "Time gap must be 0 or more").int()
})


export const bookingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    additionalInfo: z.string().optional()
})
