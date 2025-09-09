'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import HomeworkFilters from "./homework-filters";
import { ClassChar, GradeLevel, School } from "@/types";
import { Plus, Search } from "lucide-react";
import { useFilters } from "@/contexts/FilterContext";


export default function Home() {
    const [schools, setSchools] = React.useState<School[]>([]);
    const [grades, setGrades] = React.useState<GradeLevel[]>([]);
    const [classes, setClasses] = React.useState<ClassChar[]>([]);

    const { filters } = useFilters();

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
        async function fetchGrades() {
            try {
                const res = await fetch('/api/v1/grades', { cache: "no-store" });
                if (!res.ok) {
                    throw new Error('Failed to fetch grades');
                }
                const data = await res.json();
                setGrades(data);
            } catch (error) {
                toast.error("Could not load grades");
            }
        }
        fetchGrades();
    }, []);

    React.useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await fetch('/api/v1/classes', { cache: "no-store" });
                if (!res.ok) {
                    throw new Error('Failed to fetch classes');
                }
                const data = await res.json();
                setClasses(data);
            } catch (error) {
                toast.error("Could not load classes");
            }
        }
        fetchClasses();
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

    const isFiltered = filters.school_id !== null && filters.grade_id !== null && filters.class_id !== null;


    return (
        <div className="md:h-full flex flex-col gap-5 mt-5">
            <div className="flex flex-col flex-wrap gap-2 md:gap-3 items-center md:justify-center">
                <HomeworkFilters schools={schools} grades={grades} classes={classes} />
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-1/3 items-center mt-3">
                    {isFiltered ? (
                        <><Link href="/homework/create" className="w-full md:w-fit">
                            <Button
                                variant="default"
                                className="w-full md:w-fit py-4 bg-indigo-500 text-white font-semibold shadow transition-all duration-200 hover:bg-indigo-600 flex items-center gap-2"
                                style={{ cursor: "pointer" }}
                            >
                                <Plus />
                                Post Homework
                            </Button>
                        </Link><Link href="/homework/lookup" className="w-full md:w-fit">
                                <Button
                                    variant="default"
                                    className="w-full md:w-fit py-4 bg-cyan-500 text-white font-semibold shadow transition-all duration-200 hover:bg-cyan-600 flex items-center gap-2"
                                    style={{ cursor: "pointer" }}
                                >
                                    <span className="animate-[zoom_1s_ease-in-out_infinite]"><Search /></span>
                                    Lookup Homework
                                </Button>
                            </Link></>
                    ) : (
                        <>
                            <Button
                                variant="default"
                                className="w-full md:w-fit py-4 bg-indigo-500 text-white font-semibold shadow transition-all duration-200 hover:bg-indigo-600 flex items-center gap-2"
                                onClick={() => toast.error("Please select school, grade and class to post homework.")}
                            >
                                <Plus />
                                Post Homework
                            </Button>
                            <Button
                                variant="default"
                                className="w-full md:w-fit py-4 bg-cyan-500 text-white font-semibold shadow transition-all duration-200 hover:bg-cyan-600 flex items-center gap-2"
                                onClick={() => toast.error("Please select school, grade and class to lookup homework.")}
                            >
                                <span><Search /></span>
                                Lookup Homework
                            </Button>
                        </>

                    )}
                </div>
            </div>
        </div>
    );
}
