import { getUserMeetings } from '@/actions/meetings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { Suspense } from 'react'
import MeetingList from './_components/MeetingList'

export const metaData = {
    title: 'Meetings | Scheduler',
    description: "View and manage your upcoming and past meetings.",
}

const MeetingsPage = () => {
    return (
        <Tabs defaultValue='upcoming'>
            <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                <Suspense fallback={<div>Loading upcoming meetings...</div>}>
                    <UpcomingMeetings />
                </Suspense>
            </TabsContent>
            <TabsContent value="past">
                <Suspense fallback={<div>Loading past meetings...</div>}>
                    <PastMeetings />
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}

async function UpcomingMeetings() {
    const rawMeetings = await getUserMeetings("upcoming");
    const meetings = rawMeetings.map((meeting) => ({
        ...meeting,
        startTime: meeting.startTime.toISOString(),
        endTime: meeting.endTime.toISOString(),
    }));
    return <MeetingList meetings={meetings} type="upcoming" />;
}

async function PastMeetings() {
    const rawMeetings = await getUserMeetings("past");
    const meetings = rawMeetings.map((meeting) => ({
        ...meeting,
        startTime: meeting.startTime.toISOString(),
        endTime: meeting.endTime.toISOString(),
    }));
    return <MeetingList meetings={meetings} type="past" />;
}


export default MeetingsPage