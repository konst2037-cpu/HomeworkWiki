'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import { Homework, School } from "@/types";
import HomeworkSearchPage from "@/components/homework-search";
import Link from "next/link";
import { toast } from "sonner";
import HomeworkFilters from "./homework-filters";

interface HomeProps {
    schools: School[];
    homeworks: Homework[];
    error: string | null;
}

export default function Home({ schools, homeworks, error = null }: HomeProps) {


    React.useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    React.useEffect(() => {

        const userIdKey = "homework_user_id";
        let userId = localStorage.getItem(userIdKey);
        if (!userId) {
            // Use a fallback for crypto.randomUUID() for Safari/iOS
            const generateUUID = () => {
                if (window.crypto && (window.crypto.randomUUID as any)) {
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
        <div className="md:h-full flex flex-col gap-5 mt-10">
            <div className="flex flex-wrap gap-2 md:gap-3 items-center md:justify-center">
                <HomeworkFilters schools={schools} />
                <Link href="/homework/create" className="w-full md:w-fit">
                    <Button variant="default" className="w-full md:w-fit py-4" style={{ cursor: "pointer" }}>
                        Post HomeWork
                    </Button>
                </Link>
            </div>
            <HomeworkSearchPage homeworks={homeworks} />
        </div>
    );
}
