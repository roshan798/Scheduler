import { getUserEvents } from '@/actions/events'
import { Suspense } from 'react'
import EventCard from "@/components/EventCard"

export default function EventsPage() {
    return (
        <Suspense fallback={<div>Loading Events...</div>}>
            <Events />
        </Suspense>
    )
}
const Events = async () => {
    const { events, username } = await getUserEvents();
    if (events.length === 0) {
        return <div>No events found</div>
    }
    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {events?.map((event) => (
                <EventCard key={event.id} event={event} username={username} />
            ))}
        </div>
    )
}
