import React from 'react';

export const metadata = {
    title: 'Not Found',
    description: 'This page could not be found.',
};

const NotFound = () => {
    return (
        <div className='text-4xl font-extrabold w-screen pt-20 grid place-items-center'>
            <h1>404 - Page Not Found</h1>
        </div>
    );
};

export default NotFound;
