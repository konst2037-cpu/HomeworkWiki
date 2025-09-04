'use client'

import { useFilters } from "@/contexts/FilterContext";
import { cn } from "@/lib/utils";
import { Homework } from "@/types";
import React from "react";
import { toast } from "sonner";

interface HomeworkSearchPageProps {
    homeworks: Homework[];
    error?: string | null;
}

import { useRouter } from "next/navigation";

export default function HomeworkSearchPage({ homeworks, error }: HomeworkSearchPageProps) {

    React.useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const { filters, setFilters } = useFilters();
    const router = useRouter();

    const filteredHomeworks = homeworks.filter(hw => {
        let matches = true;
        if (filters.school_id) {
            matches = matches && hw.school_id === filters.school_id;
        }
        if (filters.grade_id) {
            matches = matches && hw.grade_id === filters.grade_id;
        }
        if (filters.class_id) {
            matches = matches && hw.class_id === filters.class_id;
        }
        return matches;
    });

    return (
        <div className="flex flex-col items-center w-full px-2">
            <div className="grid grid-cols-7 gap-2 w-auto md:w-full md:max-w-4xl">
                {/* Weekday labels in the first row */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((weekday) => (
                    <div
                        key={weekday}
                        className="font-semibold text-center text-gray-500 py-1 text-xs md:text-sm"
                    >
                        {weekday}
                    </div>
                ))}
                {(() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    // Start from Monday of previous week
                    const startDate = new Date(today);
                    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // Monday=0, Sunday=6
                    startDate.setDate(today.getDate() - dayOfWeek - 7);

                    const endDate = new Date(today);
                    endDate.setDate(today.getDate() - dayOfWeek + (7 * 4) + 6);

                    return Array.from({ length: 35 }).map((_, i) => {
                        const date = new Date(startDate);
                        date.setDate(startDate.getDate() + i);

                        if (date < startDate || date > endDate) return null;

                        const dayLabel = date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });

                        const homeworkCount = filteredHomeworks?.filter(hw => {
                            const hwDate = new Date(hw.delivery_date);
                            hwDate.setHours(0, 0, 0, 0);
                            return hwDate.getTime() === date.getTime();
                        }).length || 0;

                        const isToday = date.getTime() === today.getTime();
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday

                        return (
                            <div
                                key={date.toISOString()}
                                className={cn(
                                    "border border-gray-300 rounded-lg p-2 md:p-4 text-center  transition cursor-pointer text-xs md:text-sm",
                                    homeworkCount > 0 ? "bg-blue-100 shadow hover:shadow-lg" : "bg-white",
                                    isWeekend ? "bg-yellow-100" : "",
                                    isToday ? "border-green-700 bg-green-50" : ""
                                )}
                                onClick={() => {
                                    const formattedDate = [
                                        date.getFullYear().toString().padStart(4, '0'),
                                        (date.getMonth() + 1).toString().padStart(2, '0'),
                                        date.getDate().toString().padStart(2, '0')
                                    ].join('-');
                                    router.push(`/homework/list/${encodeURIComponent(formattedDate)}`);
                                }}
                            >
                                <div className={cn("mb-2", isToday ? "font-bold text-green-700" : "text-gray-700")}>
                                    {dayLabel}
                                </div>
                                <div className="text-blue-600 text-md">{homeworkCount}</div>
                            </div>
                        );
                    });
                })()}
            </div>
        </div>
    );
}
