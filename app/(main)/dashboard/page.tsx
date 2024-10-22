"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from "@/lib/validators";
import useFetch from '@/hooks/useFetch';
import { updateUsername } from '@/actions/users';
import { BarLoader } from 'react-spinners';
import { z } from 'zod';

// Define the type for form data
type FormData = z.infer<typeof userSchema>;

const Dashboard = () => {
    const { user, isLoaded } = useUser();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(userSchema),
    });

    const [origin, setOrigin] = useState<string | null>(null);

    useEffect(() => {
        // Set the window origin on the client side after component mounts
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    useEffect(() => {
        if (user?.username) {
            setValue('username', user.username);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, user]);

    const { fn: fnUpdateUserName, loading, error } = useFetch(updateUsername);

    const onSubmit = async (data: FormData) => {
        fnUpdateUserName(data.username);
        console.log(data);
    };

    return (
        <div className='space-y-8'>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.firstName}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Your Unique Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space=y=4'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <span>{origin ? origin : ''}</span>
                                <Input placeholder='username' {...register("username")} />
                            </div>
                            {errors.username && <p className='text-red-500'>{errors.username.message?.toString()}</p>}
                            {error && <p className='text-red-500'>{error.message}</p>}
                        </div>
                        {loading && <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />}
                        <Button type='submit'>Update username</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
