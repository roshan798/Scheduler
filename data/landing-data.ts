import { Calendar, Clock, LinkIcon, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
export type Feature = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    title: string;
    description: string;
};


export const features: Feature[] = [
    {
        icon: Calendar,
        title: "Create Events",
        description: "Easily set up and customize your event types",
    },
    {
        icon: Clock,
        title: "Manage Availability",
        description: "Define your availability to streamline scheduling",
    },
    {
        icon: LinkIcon,
        title: "Custom Links",
        description: "Share your personalized scheduling link",
    },
];

export type HowItWorks = {
    step: string;
    description: string;
};
export const howItWorks: HowItWorks[] = [
    { step: "Sign Up", description: "Create your free Schedulrr account" },
    {
        step: "Set Availability",
        description: "Define when you're available for meetings",
    },
    {
        step: "Share Your Link",
        description: "Send your scheduling link to clients or colleagues",
    },
    {
        step: "Get Booked",
        description: "Receive confirmations for new appointments automatically",
    },
];
export type Testimonial = {
    name: string;
    role: string;
    content: string;
    image: string;
};

export const testimonials: Testimonial[] = [
    {
        name: "Sarah Johnson",
        role: "Marketing Manager",
        content:
            "Schedulrr has transformed how I manage my team's meetings. It's intuitive and saves us hours every week!",
        image: "https://i.pravatar.cc/150?img=1",
    },
    {
        name: "David Lee",
        role: "Freelance Designer",
        content:
            "As a freelancer, Schedulrr helps me stay organized and professional. My clients love how easy it is to book time with me.",
        image: "https://i.pravatar.cc/150?img=2",
    },
    {
        name: "Emily Chen",
        role: "Startup Founder",
        content:
            "Schedulrr streamlined our hiring process. Setting up interviews has never been easier!",
        image: "https://i.pravatar.cc/150?img=3",
    },
    {
        name: "Michael Brown",
        role: "Sales Executive",
        content:
            "I've seen a 30% increase in my meeting bookings since using Schedulrr. It's a game-changer for sales professionals.",
        image: "https://i.pravatar.cc/150?img=4",
    },
];
