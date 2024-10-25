"use client";
import React from 'react';
import { daysOfWeek, timeSlots, type DefaultAvailability } from '../data';
import { updateAvailability, type AvailabilityData } from '@/actions/availability';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { availabilitySchema } from '@/lib/validators';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';

type Props = {
    initialData: DefaultAvailability | AvailabilityData;
};

const AvailabilityForm: React.FC<Props> = ({ initialData }) => {
    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<AvailabilityData>({
        resolver: zodResolver(availabilitySchema),
        defaultValues: { ...initialData },
    });

    const { fn: fnUpdateavailability, loading } = useFetch(updateAvailability);
    const onSubmit = async (data: AvailabilityData) => {
        console.log("called",errors);
        const res = await fnUpdateavailability(data);
        console.log(res);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {daysOfWeek.map((day, index) => {
                const isAvailable = watch(`${day}.isAvailable`);
                return (
                    <div key={index} className="flex items-center space-x-4 mb-4">
                        <Controller
                            name={`${day}.isAvailable`}
                            control={control}
                            render={({ field }) => (
                                <Checkbox checked={field.value} onCheckedChange={(checked) => {
                                    setValue(`${day}.isAvailable`, !!checked);
                                    if (!checked) {
                                        setValue(`${day}.startTime`, '09:00');
                                        setValue(`${day}.endTime`, '17:00');
                                    }
                                }} />
                            )}
                        />

                        <span className="w-24">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </span>
                        {isAvailable && (
                            <>
                                <Controller
                                    name={`${day}.startTime`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Start Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map((time) => (
                                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <span>To</span>
                                <Controller
                                    name={`${day}.endTime`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="End Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map((time) => (
                                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {(errors[day]?.message) && (
                                    <span className="text-red-500 text-sm ml-2">
                                        {errors[day]?.message}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
            <div className="flex items-center space-x-4">
                <span className="w-48">
                    Minimum gap before booking (minutes):
                </span>
                <Input type="number" {...register("timeGap", { valueAsNumber: true })} className="w-32" />
                {errors.timeGap && (
                    <span className="text-red-500 text-sm ml-2">
                        {errors.timeGap?.message}
                    </span>
                )}
            </div>
            <Button className="mt-4" type="submit" disabled={loading}>
                {loading ? "Updating" : "Update Availability"}
            </Button>
        </form>
    );
};

export default AvailabilityForm;
