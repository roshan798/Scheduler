"use server";

import db from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { z } from "zod";
import { bookingSchema } from "@/lib/validators";

// Define types based on the booking schema
type BookingData = z.infer<typeof bookingSchema> & {
    eventId: string;
    start: string;  // DateTime format
    end: string;    // DateTime format
};

// Define the types for the returned booking object
type Booking = {
    name: string;
    email: string;
    additionalInfo: string | null;
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    startTime: Date;
    endTime: Date;
    meetLink: string;
    googleEventId: string;

};

// Define the function's response type
type CreateBookingResponse = {
    success: boolean;
    booking?: Booking;
    meetLink?: string;
    error?: string;
};

export async function createBooking(bookingData: BookingData): Promise<CreateBookingResponse> {
    try {
        const event = await db.event.findUnique({
            where: { id: bookingData.eventId },
            include: { user: true }
        });
        if (!event) {
            throw new Error("Event not found");
        }

        // Get OAuth access token for the event's user
        const { data } = await clerkClient().users.getUserOauthAccessToken(
            event.user.clerkUserId,
            "oauth_google"
        );
        const token = data[0]?.token;

        if (!token) {
            throw new Error("Event creator has not connected to Google Calendar");
        }

        // Set up Google Calendar API
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Create a Google Calendar event with video conferencing
        const meetResponse = await calendar.events.insert({
            calendarId: "primary",
            conferenceDataVersion: 1,
            requestBody: {
                summary: `${bookingData.name} - ${event.title}`,
                description: bookingData.additionalInfo,
                start: { dateTime: bookingData.start },
                end: { dateTime: bookingData.end },
                attendees: [{ email: bookingData.email }, { email: event.user.email }],
                conferenceData: {
                    createRequest: { requestId: `${event.id}-${Date.now()}` },
                },
            },
        });
        const meetLink = meetResponse.data.hangoutLink;
        const googleEventId = meetResponse.data.id;
        if (!meetLink) {
            throw new Error("Failed to create Google Meet link");
        }
        if (!googleEventId) {
            throw new Error("Failed to create Google Calendar event");
        }

        // Save the booking in the database

        const booking = await db.booking.create({
            data: {
                eventId: event.id,
                userId: event.userId,
                name: bookingData.name,
                email: bookingData.email,
                startTime: bookingData.start,
                endTime: bookingData.end,
                additionalInfo: bookingData.additionalInfo,
                meetLink,
                googleEventId,
            },
        });

        return {
            success: true,
            booking,
            meetLink,
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error creating booking:", errorMessage);
        return {
            success: false,
            error: errorMessage,
        };
    }
}
