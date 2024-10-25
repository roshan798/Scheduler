import React, { Suspense } from 'react'

const AvailabilityLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='mx-auto'>
            <Suspense fallback={<div className='w-full flex items-center justify-center'>Loading Availbility Details...</div>}>
                {children}
            </Suspense>
        </div>
    )
}

export default AvailabilityLayout