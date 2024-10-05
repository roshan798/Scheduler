"use client";
import React from 'react'
import { testimonials } from '@/data/landing-data'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Autoplay from "embla-carousel-autoplay";
function TestimonialsCarousel() {
    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 5000,
                }),
            ]}
            className="w-full mx-auto"
        >
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full">
                            <CardContent className="flex flex-col justify-between h-full p-6">
                                <p className="text-gray-600 mb-4">
                                    &quot;{testimonial.content}&quot;
                                </p>
                                <div className="flex items-center mt-4">
                                    <Avatar className="h-12 w-12 mr-4">
                                        <AvatarImage
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                        />
                                        <AvatarFallback>
                                            {testimonial.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}

export default TestimonialsCarousel