"use server";

import db from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod"; // Ensure zod is imported

type EventData = z.infer<typeof eventSchema>;
type Event = {
    title: string;
    description: string | null;
    duration: number;
    isPrivate: boolean;
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function createEvent(data: EventData): Promise<Event> {
    const { userId } = auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Validate data using the schema
    const validatedData = eventSchema.parse(data);

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const event = await db.event.create({
        data: {
            ...validatedData,
            userId: user.id,
        },
    });

    return event;
}


export async function getUserEvents() {
    const { userId } = auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const events = await db.event.findMany({
        where: {
            userId: user.id,
        },
        orderBy: { createdAt: "desc", },
        include: {
            _count: {
                select: { bookings: true }
            }
        }
    });

    return { events, username: user.username }
}


export async function deleteEvent(eventId: string) {
    const { userId } = auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const event = await db.event.findUnique({
        where: { id: eventId },
    });

    if (!event || event.userId !== user.id) {
        throw new Error("Event not found or unauthorized");
    }

    await db.event.delete({
        where: { id: eventId },
    });

    return { success: true };
}