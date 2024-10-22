"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useSearchParams, useRouter } from "next/navigation"
import EventForm from "./EventForm"


export default function CreateEventsDrawer() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Open the drawer if the query param is set to true
    useEffect(() => {
        if (searchParams.get("create") === "true") {
            setIsOpen(true)
        }
    }, [searchParams])

    const handleClose = () => {
        setIsOpen(false);
        if (searchParams.get("create") === "true") {
            router.replace(window?.location?.pathname)
        }
    }

    return (
        <Drawer open={isOpen} onClose={handleClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Event</DrawerTitle>
                </DrawerHeader>

                <EventForm onSubmitForm={() => { handleClose() }} />
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={handleClose} className="max-w-64-">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
