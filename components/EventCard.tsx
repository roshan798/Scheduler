"use client";

import { deleteEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { Link, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, MouseEvent } from "react";

// Define Event type
type Event = {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    userId ?: string;
    isPrivate: boolean;
    createdAt ?: Date;
    updatedAt ?: Date;
    _count: {
        bookings: number;
    };
};

type EventCardProps = {
    event: Event;
    username: string | null;
    isPublic?: boolean;  // Optional, defaults to false
};

const EventCard: React.FC<EventCardProps> = ({ event, username, isPublic = false }) => {
    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                `${window?.location.origin}/${username}/${event.id}`
            );
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    // useFetch hook for deleting an event
    const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

    const handleDelete = async () => {
        if (window?.confirm("Are you sure you want to delete this event?")) {
            await fnDeleteEvent(event.id);
            router.refresh();
        }
    };

    const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
        // Ensure buttons and SVGs don't trigger card click
        if ((e.target as HTMLElement).tagName !== "BUTTON" && (e.target as HTMLElement).tagName !== "SVG") {
            window?.open(
                `${window?.location.origin}/${username}/${event.id}`,
                "_blank"
            );
        }
    };

    return (
        <Card
            className="flex flex-col justify-between cursor-pointer"
            onClick={handleCardClick}
        >
            <CardHeader>
                <CardTitle className="text-2xl">{event.title}</CardTitle>
                <CardDescription className="flex justify-between">
                    <span>
                        {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
                    </span>
                    <span>{event._count.bookings} Bookings</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {/* Display the first sentence of the description, if available */}
                    {event.description && event.description.split(".")[0]}.
                </p>
            </CardContent>
            {!isPublic && (
                <CardFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="flex items-center"
                    >
                        <Link className="mr-2 h-4 w-4" />
                        {isCopied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

export default EventCard;
