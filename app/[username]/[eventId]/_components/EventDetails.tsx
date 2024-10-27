import React from 'react'
import type { GetEventDetails, User } from '../page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';
type EventDetailsProps = {
    event: GetEventDetails;
}
const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
    const user: User = event?.user as User;
    // if (!user) return null;
    if (!event) return null;
    return (
        <div className='p-10 lg:w-1/3 bg-white'>
            <h1 className='txt-3xl font-bold mb-4'>{event.title}</h1>
            <div className='flex items-center mb-4'>
                <Avatar className='w-12 h-12 mr-4'>
                    <AvatarImage src={user?.imageUrl as string} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className=''>
                    <h2 className='text-xl font-semibold '>{user.name}</h2>
                    <h2 className='text-gray-600'>@{user.username}</h2>
                </div>
            </div>
            <div className='flex items-center mb-2'>
                <Clock className="mr-2" />
                <span>
                    {event.duration} minutes
                </span>
            </div>
            <div className='flex items-center mb-2'>
                <Calendar className="mr-2" />
                <span>
                    Google Meet
                </span>
            </div>
            <p className='text-gray-700'>{event.description}</p>
        </div>
    )
}

export default EventDetails