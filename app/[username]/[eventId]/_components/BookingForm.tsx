"use client"
import { bookingSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { createBooking } from '@/actions/bookings'

type BookingFormInput = {
    name: string;
    email: string;
    additionalInfo?: string;
    date: string;
    time: string;
};

interface Event {
    id: string;
    title: string;
    duration: number; // Duration in minutes
}

interface Availability {
    date: string; // Format as 'yyyy-MM-dd'
    slots: string[]; // Array of time slots
}

interface BookingFormProps {
    event: Event;
    availability: Availability[];
}

const BookingForm: React.FC<BookingFormProps> = ({ event, availability }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<BookingFormInput>({
        resolver: zodResolver(bookingSchema)
    })

    const availableDays = availability.map((day) => new Date(day.date));

    const timeSlots = selectedDate
        ? availability.find((day) => day.date === format(selectedDate, 'yyyy-MM-dd'))?.slots || []
        : [];

    useEffect(() => {
        if (selectedDate) {
            setValue("date", format(selectedDate, "yyyy-MM-dd"))
        }
    }, [selectedDate, setValue])

    useEffect(() => {
        if (selectedTime) {
            setValue("time", selectedTime)
        }
    }, [selectedTime, setValue])

    const { loading, data, fn: fnCreateBooking } = useFetch(createBooking)

    const onSubmit: SubmitHandler<BookingFormInput> = async (data) => {
        if (!selectedDate || !selectedTime) {
            console.error("Please select a date and time")
            return;
        }

        const startTime = new Date(
            `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`
        )
        const endTime = new Date(startTime.getTime() + event.duration * 60000)

        const bookingData = {
            eventId: event.id,
            name: data.name,
            email: data.email,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            additionalInfo: data.additionalInfo,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime
        };

        await fnCreateBooking(bookingData);
    }

    if (data) {
        return (
            <div className='text-center p-10 border bg-white'>
                <h2 className='text-2xl font-semibold mb-4'>Booking Successful</h2>
                {data.meetLink &&
                    <>
                        <p>Your event has been booked successfully. You can join the event using the link below:</p>
                        <a href={data.meetLink} target='_blank' className='text-blue-500 hover:underline' rel='noopener noreferrer'>{data.meetLink}</a>
                    </>}
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-8 p-10 border bg-white'>
            <div className='md:h-96 flex flex-col md:flex-row gap-5'>
                <div className='w-full'>
                    <DayPicker
                        mode='single'
                        selected={selectedDate}
                        onSelect={(date) => {
                            setSelectedDate(date)
                            setSelectedTime(null)
                        }}
                        disabled={{ before: new Date() }}
                        modifiers={{ available: availableDays }}
                        modifiersStyles={{
                            available: { background: "lightBlue", borderRadius: 100 }
                        }}
                    />
                </div>
                <div>
                    {selectedDate && (
                        <div className="w-full h-full md:overflow-scroll no-scrollbar">
                            <h3 className='text-lg font-semibold mb-2'>Available Time Slots</h3>
                            <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
                                {timeSlots.map((slot) => (
                                    <Button
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        variant={selectedTime === slot ? 'default' : 'outline'}
                                    >
                                        {slot}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {selectedTime && (
                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Input {...register("name")} placeholder='Your Name' />
                        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
                    </div>
                    <div>
                        <Input {...register("email")} placeholder='Your Email' />
                        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                    </div>
                    <div>
                        <Textarea {...register("additionalInfo")} placeholder='Additional Information' />
                        {errors.additionalInfo && <p className='text-red-500 text-sm'>{errors.additionalInfo.message}</p>}
                    </div>
                    <Button type='submit' disabled={loading} className='w-full'>
                        {loading ? "Scheduling" : "Schedule Event"}
                    </Button>
                </form>
            )}
        </div>
    )
}

export default BookingForm
