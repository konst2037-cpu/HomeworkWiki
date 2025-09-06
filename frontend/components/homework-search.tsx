'use client'

import { useFilters } from "@/contexts/FilterContext";
import { cn } from "@/lib/utils";
import { Homework } from "@/types";
import React from "react";
import { toast } from "sonner";


import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

export default function HomeworkSearchPage() {
    const [homeworks, setHomeworks] = React.useState<Homework[]>([]);
    const { filters, setFilters } = useFilters();
    const router = useRouter();

    // Set all filters from shared link parameters on page load.
    // This allows users to view homeworks directly without manually selecting school, grade, or class.
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        setFilters(prev => ({
            school_id: params.has('school_id') ? Number(params.get('school_id')) : prev.school_id,
            grade_id: params.has('grade_id') ? Number(params.get('grade_id')) : prev.grade_id,
            class_id: params.has('class_id') ? Number(params.get('class_id')) : prev.class_id,
            schoolName: params.has('school') ? params.get('school') ?? prev.schoolName : prev.schoolName,
            className: params.has('class') ? params.get('class') ?? prev.className : prev.className,
        }));

        if (params.has('school_id')) localStorage.setItem('homework_school_id', params.get('school_id')!);
        if (params.has('grade_id')) localStorage.setItem('homework_grade', params.get('grade_id')!);
        if (params.has('class_id')) localStorage.setItem('homework_class_id', params.get('class_id')!);
        if (params.has('school')) localStorage.setItem('homework_school', params.get('school')!);
        if (params.has('class')) localStorage.setItem('homework_class', params.get('class')!);
    }, []);

    React.useEffect(() => {
        async function fetchHomeworks() {
            try {
                const params = new URLSearchParams();
                if (filters.school_id) params.set('school_id', filters.school_id.toString());
                if (filters.grade_id) params.set('grade_id', filters.grade_id.toString());
                if (filters.class_id) params.set('class_id', filters.class_id.toString());
                const res = await fetch(`/api/v1/homeworks?${params.toString()}`, { cache: "no-store" });
                if (!res.ok) {
                    throw new Error('Failed to fetch homeworks');
                }
                const data = await res.json();
                setHomeworks(data);
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch homeworks');
            }
        }
        fetchHomeworks();
    }, []);

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

                        const homeworkCount = homeworks?.filter(hw => {
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
            <div className="flex justify-end w-full md:max-w-4xl">
                <Button
                    variant="default"
                    className="cursor-pointer my-2"
                    onClick={() => {
                        const currentUrl = window.location.href;
                        const params = new URLSearchParams();
                        if (filters.school_id) params.set('school_id', filters.school_id.toString());
                        if (filters.grade_id) params.set('grade_id', filters.grade_id.toString());
                        if (filters.class_id) params.set('class_id', filters.class_id.toString());
                        if (filters.className) params.set('class', filters.className.toString());
                        if (filters.schoolName) params.set('school', filters.schoolName.toString());
                        const shareUrl = `${currentUrl.split('?')[0]}?${params.toString()}`;
                        navigator.clipboard.writeText(shareUrl);
                        navigator.share({ title: "Homework Link", text: "Check out this homework link!", url: shareUrl });
                        toast.info("Homework link copied!");
                    }}
                >
                    <Copy /> Share homework
                </Button>
            </div>
        </div >
    );
}
