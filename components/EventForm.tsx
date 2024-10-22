"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import useFetch from '@/hooks/useFetch';
import { createEvent } from '@/actions/events';
import { useRouter } from 'next/navigation';
import { eventSchema } from '@/lib/validators';
import { z } from 'zod';

// Define the form data type based on eventSchema
type FormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
    onSubmitForm: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmitForm }) => {
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            duration: 30,
            isPrivate: true,
        },
    });

    // Update useFetch to expect an Event response
    const { fn: fnCreateEvent, loading, error } = useFetch(createEvent);

    const onSubmit = async (data: FormValues) => {
        await fnCreateEvent(data);
        if (!loading && !error) {
            onSubmitForm();
        }
        router.refresh();
    };

    return (
        <form className='px-5 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="title" className='block font-medium text-gray-700'>
                    Event Title
                </label>
                <Input id='title' {...register("title")} className='mt-1' />
                {errors.title && <p className='text-red-500 mt-1'>{errors.title.message}</p>}
            </div>
            <div>
                <label htmlFor="description" className='block font-medium text-gray-700'>
                    Event Description
                </label>
                <Input id='description' {...register("description")} className='mt-1' />
                {errors.description && <p className='text-red-500 mt-1'>{errors.description.message}</p>}
            </div>
            <div>
                <label htmlFor="duration" className='block font-medium text-gray-700'>
                    Duration <span className='text-sm'>(Minutes)</span>
                </label>
                <Input id='duration' {...register("duration", { valueAsNumber: true })} type='number' className='mt-1' />
                {errors.duration && <p className='text-red-500 mt-1'>{errors.duration.message}</p>}
            </div>
            <div>
                <label htmlFor="isPrivate" className='block font-medium text-gray-700'>
                    Event Privacy
                </label>
                <Controller
                    name="isPrivate"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value ? 'true' : 'false'} onValueChange={(val) => field.onChange(val === 'true')}>
                            <SelectTrigger className='mt-1'>
                                <SelectValue placeholder="Select privacy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='true'>Private</SelectItem>
                                <SelectItem value='false'>Public</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.isPrivate && <p className='text-red-500 mt-1'>{errors.isPrivate.message}</p>}
            </div>
            {error && <p className='text-red-500 mt-1'>{error.message}</p>}
            <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Create Event"}
            </Button>
        </form>
    );
};

export default EventForm;
