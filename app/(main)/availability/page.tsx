import { getUserAvailability } from '@/actions/availability'
import React from 'react'
import { defaultAvailability } from './data';
import AvailabilityForm from './_components/AvailabilityForm';

const Availability = async () => {
    const availbility = await getUserAvailability();
    console.log(availbility);
    return (
        <AvailabilityForm initialData={availbility || defaultAvailability} />
    )
}

export default Availability