"use server"
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { DayOfWeek } from '@prisma/client'; // Ensure this is the correct import

// Define the structure of the availability data
export type AvailabilityData = {
    timeGap: number;
    [key: string]: {
        isAvailable: boolean;
        startTime: string;
        endTime: string;
    } | number;
};

export async function getUserAvailability(): Promise<AvailabilityData | null> {
    const { userId } = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Fetch the user with availability and days included
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
        include: {
            availability: {
                include: {
                    days: true,
                },
            },
        },
    });
    if (!user || !user.availability) {
        return null;
    }
    const availabilityData: AvailabilityData = {
        timeGap: user.availability.timeGap,
    };

    const daysOfWeek = [
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    ] as const;

    daysOfWeek.forEach((day) => {
        if (user.availability) {
            const dayAvailability = user.availability.days.find((d) => d.day.toLowerCase() === day.toLowerCase());

            availabilityData[day.toLowerCase()] = {
                isAvailable: !!dayAvailability,
                startTime: dayAvailability
                    ? dayAvailability.startTime.toISOString().slice(11, 16)
                    : "09:00",
                endTime: dayAvailability
                    ? dayAvailability.endTime.toISOString().slice(11, 16)
                    : "17:00"
            };
        }
    });

    return availabilityData;
}

export async function updateAvailability(data: AvailabilityData): Promise<{ success: boolean }> {
    const { userId } = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { availability: true },
    });


    if (!user) {
        throw new Error("User not found");
    }

    // Prepare availability data
    const availabilityData = Object.entries(data).flatMap(([day, value]) => {
        if (typeof value === "object" && value.isAvailable) {
            const baseDate = new Date().toISOString().split("T")[0];
            return {
                day: day.toUpperCase() as DayOfWeek,
                startTime: new Date(`${baseDate}T${value.startTime}:00Z`),
                endTime: new Date(`${baseDate}T${value.endTime}:00Z`),
            };
        }
        return [];
    });

    // Prisma query: updating or creating availability
    if (user.availability) {
        await db.availability.update({
            where: { id: user.availability.id },
            data: {
                timeGap: data.timeGap,
                days: {
                    deleteMany: {}, // Clear existing days
                    create: availabilityData, // Add new days
                },
            },
        });
    } else {
        await db.availability.create({
            data: {
                userId: user.id,
                timeGap: data.timeGap,
                days: { create: availabilityData },
            },
        });
    }

    return { success: true };
}
