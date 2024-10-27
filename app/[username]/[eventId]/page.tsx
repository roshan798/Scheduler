import { getEventAvailability, getEventDetails } from '@/actions/events';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import EventDetails from './_components/EventDetails';
import BookingForm from './_components/BookingForm';

interface EventPageProps {
    params: {
        username: string;
        eventId: string
    };
}

interface GenerateMetaDataParams {
    params: {
        username: string;
        eventId: string;
    };
}

interface MetaData {
    title: string;
    description?: string;
    image?: string;
}

export async function generateMetadata({ params }: GenerateMetaDataParams): Promise<MetaData> {
    const event = await getEventDetails(params.username, params.eventId);
    if (!event) {
        return {
            title: 'Event Not Found | Scheduler',
        };
    }
    return {
        title: `Book ${event.title} with ${event.user.name} | Scheduler`,
        description: `Schedule a ${event.duration}-minutes ${event.title} event with ${event.user.name}.`,
    };
}

export interface User {
    email: string;
    name: string | null;
    imageUrl: string | null;
    username: string | null;

}
export interface Event {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    userId: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type GetEventDetails = ({
    user: User;
} & Event) | null;

const EventPage: React.FC<EventPageProps> = async ({ params }) => {
    const event: GetEventDetails = await getEventDetails(params.username, params.eventId);
    const availability = await getEventAvailability(params.eventId);
    // console.log(event, availability);

    if (!event) {
        notFound();
    }

    return (
        <div className='flex flex-col justify-center lg:flex-row px-4 py-8'>
            <EventDetails event={event} />
            <Suspense fallback={<div>Loading booking Form...</div>}>
                <BookingForm event={event} availability={availability} />
            </Suspense>

        </div>
    );
};

export default EventPage;
