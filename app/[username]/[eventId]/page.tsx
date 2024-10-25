import { getUserByUserName } from '@/actions/users';
import EventCard from '@/components/EventCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { notFound } from 'next/navigation';
import React from 'react';

interface UserPageProps {
    params: {
        username: string;
    };
}

interface User {
    id: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
    events: {
        id: string;
        _count: {
            bookings: number;
        };
        isPrivate: boolean;
        title: string;
        description: string | null;
        duration: number;
    }[];
}

interface GenerateMetaDataParams {
    params: {
        username: string;
    };
}

interface MetaData {
    title: string;
    description: string;
    image?: string;
}

export async function generateMetadata({ params }: GenerateMetaDataParams): Promise<MetaData> {
    const user = await getUserByUserName(params.username);
    if (!user) {
        return {
            title: 'User Not Found | Scheduler',
            description: 'User not found. Please check the username and try again.',
        };
    }
    return {
        title: `${user?.name}'s Profile | Scheduler`,
        description: `Book an event with ${user?.name}. View available public events and schedules.`,
        image: user?.imageUrl as string,
    };
}


const UserPage: React.FC<UserPageProps> = async ({ params }) => {
    const user: User | null = await getUserByUserName(params.username);
    console.log(params.username, user);

    if (!user) {
        notFound();
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col items-center mb-8'>
                <Avatar className='w-24 h-24 mb-4'>
                    <AvatarImage src={user.imageUrl as string} alt={user.name as string} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className='text-3xl font-bold mb-2'>{user.name}</h1>
                <p className='to-gray-600 text-center'>
                    Welcome to my scheduling page. Please select an event to book a slot.
                </p>
            </div>
            {
                user.events.length === 0
                    ? (
                        <p className='text-center text-gray-600'>
                            No Public events available.
                        </p>
                    ) : (
                        <div className='grid gap-6 md:grid-cols-2'>
                            {user.events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    username={params.username}
                                    isPublic={true}
                                />
                            ))}
                        </div>
                    )
            }
        </div>
    );
};

export default UserPage;
