"use server";

import db from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username: string) {
    // update username
    const { userId } = auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const existingUsername = await db.user.findUnique({
        where: {
            username,
        },
    });

    if (existingUsername && existingUsername.id !== userId) {
        throw new Error("Username already taken");
    }

    await db.user.update({
        where: { clerkUserId: userId },
        data: { username }
    })

    await clerkClient.users.updateUser(userId, {
        username
    });
    return { success: true }
}

export async function getUserByUserName(username: string) {
    const user = await db.user.findUnique({
        where: { username },
        select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            events: {
                where: {
                    isPrivate: false,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    duration: true,
                    isPrivate: true,
                    _count: {
                        select: { bookings: true }
                    }
                }
            },
        }
    })
    return user;
}