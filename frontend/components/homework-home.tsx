'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import HomeworkFilters from "./homework-filters";
import { School } from "@/types";


export default function Home() {
    const [schools, setSchools] = React.useState<School[]>([]);

    React.useEffect(() => {
        async function fetchSchools() {
            try {
                const res = await fetch('/api/v1/schools', { cache: "no-store" });
                if (!res.ok) {
                    throw new Error('Failed to fetch schools');
                }
                const data = await res.json();
                setSchools(data);
            } catch (error) {
                toast.error("Could not load schools");
            }
        }
        fetchSchools();
    }, []);

    React.useEffect(() => {

        const userIdKey = "homework_user_id";
        let userId = localStorage.getItem(userIdKey);
        if (!userId) {
            // Use a fallback for crypto.randomUUID() for Safari/iOS
            const generateUUID = () => {
                if (window.crypto && typeof window.crypto.randomUUID === "function") {
                    return window.crypto.randomUUID();
                }
                // Fallback UUID v4 generator
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };
            userId = generateUUID();
            localStorage.setItem(userIdKey, userId);
        }

    }, []);


    return (
        <div className="md:h-full flex flex-col gap-5">
            <div className="flex flex-col flex-wrap gap-2 md:gap-3 items-center md:justify-center">
                <HomeworkFilters schools={schools} />
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-1/3">
                    <Link href="/homework/create" className="w-full md:w-fit">
                        <Button variant="default" className="w-full md:w-fit py-4" style={{ cursor: "pointer" }}>
                            Post Homework
                        </Button>
                    </Link>
                    <Link href="/homework/lookup" className="w-full md:w-fit">
                        <Button variant="default" className="w-full md:w-fit py-4" style={{ cursor: "pointer" }}>
                            Lookup Homework
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
