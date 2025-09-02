'use client'

import { default as HomeworkComp } from "@/components/homework";
import { Homework } from "@/types";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import React from "react";

function getDateFormatted(inputDate?: Date) {
    const date = inputDate ?? new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
}

type DeliveryParams = { delivery_date: string };

interface ListPageProps {
    params: Promise<DeliveryParams>;
}

export default function HomeworkListPage({ params }: ListPageProps) {
    const { delivery_date } = React.use(params) as DeliveryParams;
    const [currentDate, _] = React.useState(delivery_date);
    const [homeworks, setHomeworks] = React.useState<Homework[]>([]);
    const [deliveryDates, setDeliveryDates] = React.useState<string[]>([]);


    React.useEffect(() => {
        fetch(`/api/v1/homeworks/by_delivery_date/${encodeURIComponent(currentDate)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => setHomeworks(data))
            .catch(err => console.error(err));
    }, [currentDate]);

    React.useEffect(() => {
        fetch('/api/v1/homeworks')
            .then(res => res.json())
            .then(data => {
                const dates = Array.from(new Set(data.map((hw: Homework) => hw.delivery_date))) as string[];
                setDeliveryDates(dates);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between md:py-2 px-6">
                <button
                    className="p-2 rounded-full hover:bg-slate-300 transition"
                    onClick={() => {
                        const currentIndex = deliveryDates.findIndex(date => date === currentDate);
                        const prevDeliveryDate = deliveryDates[currentIndex - 1];
                        if (prevDeliveryDate) {
                            window.location.href = `/homework/list/${encodeURIComponent(prevDeliveryDate)}`;
                        }
                    }}
                >
                    <ArrowBigLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h3 className="md:text-2xl font-bold text-slate-800 tracking-tight">
                    {getDateFormatted(new Date(currentDate))}
                </h3>
                <button
                    className="p-2 rounded-full hover:bg-slate-300 transition"
                    onClick={() => {
                        const currentIndex = deliveryDates.findIndex(date => date === currentDate);
                        const nextDeliveryDate = deliveryDates[currentIndex + 1];
                        if (nextDeliveryDate) {
                            window.location.href = `/homework/list/${encodeURIComponent(nextDeliveryDate)}`;
                        }
                    }}
                >
                    <ArrowBigRight className="w-6 h-6 text-slate-600" />
                </button>
            </div>
            <div className="flex flex-col gap-3 px-6 py-4">
                {Array.isArray(homeworks) && homeworks.length > 0 ? (
                    homeworks
                        .map((hw, idx) => (
                            <HomeworkComp key={idx} subject={hw.subject} content={hw.content} />
                        ))
                ) : (
                    <div className="text-slate-500 flex justify-center items-center h-40">No homework found.</div>
                )}
            </div>
        </div>
    );
}
