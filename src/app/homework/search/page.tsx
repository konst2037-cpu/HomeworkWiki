'use client'

import { Homework } from "@/types";
import React from "react";

export default function HomeworkSearchPage() {
    const [homeworks, setHomeworks] = React.useState<Homework[]>([]);

    React.useEffect(() => {
        fetch('/api/v1/homeworks')
            .then(response => response.json())
            .then(data => {
                // Handle the fetched homework data
                setHomeworks(data);
            });
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div className="p-4 sm:p-6 max-w-6xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                    {Array.from({ length: 14 }).map((_, i) => {
                        const date = new Date();
                        date.setHours(0, 0, 0, 0);
                        date.setDate(date.getDate() + i);
                        const dayLabel = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

                        // Count homeworks with deliveryDate matching this day
                        const homeworkCount = homeworks.filter(hw => {
                            const hwDate = new Date(hw.delivery_date);
                            hwDate.setHours(0, 0, 0, 0);
                            return hwDate.getTime() === date.getTime();
                        }).length;

                        return (
                            <><div
                                key={date.toISOString()}
                                className="border border-gray-300 rounded-lg p-2 text-center bg-white shadow hover:shadow-lg transition cursor-pointer"
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
                            </div></>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
