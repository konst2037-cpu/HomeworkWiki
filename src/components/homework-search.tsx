'use client'

import { cn } from "@/lib/utils";
import { Homework } from "@/types";
import React from "react";

interface HomeworkSearchPageProps {
    homeworks: Homework[];
}

export default function HomeworkSearchPage({ homeworks }: HomeworkSearchPageProps) {
    return (
        <div className="flex items-center justify-between md:justify-center">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-2">
                {Array.from({ length: 14 }).map((_, i) => {
                    const date = new Date();
                    date.setHours(0, 0, 0, 0);
                    date.setDate(date.getDate() + i);
                    const dayLabel = date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });

                    // Count homeworks with deliveryDate matching this day
                    const homeworkCount = homeworks?.filter(hw => {
                        const hwDate = new Date(hw.delivery_date);
                        hwDate.setHours(0, 0, 0, 0);
                        return hwDate.getTime() === date.getTime();
                    }).length || 0;

                    return (
                        <div
                            key={date.toISOString()}
                            className={cn(
                                "border border-gray-300 rounded-lg p-2 text-center shadow hover:shadow-lg transition cursor-pointer",
                                homeworkCount > 0 ? "bg-blue-100" : "bg-white"
                            )}
                            onClick={() => {
                                const formattedDate = [
                                    date.getFullYear().toString().padStart(4, '0'),
                                    (date.getMonth() + 1).toString().padStart(2, '0'),
                                    date.getDate().toString().padStart(2, '0')
                                ].join('-');
                                window.location.href = `/homework/list/${encodeURIComponent(formattedDate)}`;
                            }}
                        >
                            <div className="text-gray-700 mb-2">{dayLabel}</div>
                            <div className="text-blue-600 text-md">{homeworkCount} homework</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
