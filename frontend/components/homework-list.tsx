'use client'

import HomeworkComp from "@/components/homework";
import { useFilters } from "@/contexts/FilterContext";
import { Homework } from "@/types";
import { ArrowBigLeft, ArrowBigRight, ArrowLeft, MoveLeft, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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
    const [currentDate, setCurrentDate] = React.useState<string>("");
    const [homeworks, setHomeworks] = React.useState<Homework[]>([]);
    const [deliveryDates, setDeliveryDates] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { filters, setFilters } = useFilters();

    // Get delivery_date from params
    React.useEffect(() => {
        params.then(({ delivery_date }) => setCurrentDate(delivery_date));
    }, [params]);

    // Fetch homeworks for currentDate
    React.useEffect(() => {
        if (!currentDate) return;

        setLoading(true);

        // Filters
        const params = new URLSearchParams({
            delivery_date: currentDate,
        });

        if (filters.school_id) params.append("school_id", filters.school_id.toString());
        if (filters.grade_id) params.append("grade_id", filters.grade_id.toString());
        if (filters.class_id) params.append("class_id", filters.class_id.toString());

        setLoading(true);

        fetch(`/api/v1/homeworks?${params.toString()}`)
            .then(res => res.json())
            .then(data => setHomeworks(data))
            .catch(err => setHomeworks([]))
            .finally(() => setLoading(false));
    }, [currentDate]);

    // Fetch all delivery dates
    React.useEffect(() => {
        fetch('/api/v1/homeworks')
            .then(res => res.json())
            .then(data => {
                const dates = Array.from(new Set(data.map((hw: Homework) => hw.delivery_date))) as string[];
                dates.sort();
                setDeliveryDates(dates);
            })
            .catch(() => setDeliveryDates([]));
    }, []);

    const currentIndex = deliveryDates.findIndex(date => date === currentDate);
    const prevDeliveryDate = deliveryDates[currentIndex - 1];
    const nextDeliveryDate = deliveryDates[currentIndex + 1];

    const handleNavigate = (date?: string) => {
        if (date) setCurrentDate(date);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-10 justify-center md:py-2">
                <Button
                    className="p-2 rounded-full hover:bg-slate-300 transition disabled:opacity-50"
                    onClick={() => handleNavigate(prevDeliveryDate)}
                    disabled={!prevDeliveryDate}
                    aria-label="Previous date"
                    variant={"outline"}
                >
                    <ArrowBigLeft className="w-6 h-6 text-slate-600" />
                </Button>
                <h3 className="md:text-2xl font-bold text-slate-800 tracking-tight">
                    {currentDate ? getDateFormatted(new Date(currentDate)) : "Loading..."}
                </h3>
                <Button
                    className="p-2 rounded-full hover:bg-slate-300 transition disabled:opacity-50"
                    onClick={() => handleNavigate(nextDeliveryDate)}
                    disabled={!nextDeliveryDate}
                    aria-label="Next date"
                    variant={"outline"}
                >
                    <ArrowBigRight className="w-6 h-6 text-slate-600" />
                </Button>
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
                <Link href="/homework/lookup" className="md:w-fit">
                    <Button
                        variant="default"
                        className="w-full md:w-fit bg-cyan-500 text-white font-semibold shadow transition-all duration-200 hover:bg-cyan-600 flex items-center gap-2"
                        style={{ cursor: "pointer" }}
                    >
                        <span className="animate-[zoom_1s_ease-in-out_infinite]"><Search /></span>
                        Lookup Homework
                    </Button>
                </Link>
                <Button className="text-cyan-700 font-medium"
                    variant={"outline"}>
                    Total: <Badge className="bg-cyan-500 text-white">{homeworks.length}</Badge>
                </Button>
            </div>
            <div className="flex flex-col gap-1 py-2 overflow-y-auto max-h-[60vh]">
                {loading ? (
                    <div className="text-slate-500 flex justify-center items-center h-40">Loading...</div>
                ) : Array.isArray(homeworks) && homeworks.length > 0 ? (
                    homeworks.map((hw) => (

                        <HomeworkComp key={hw.id} subject={hw.subject} content={hw.content} id={hw.id} />
                    ))
                ) : (
                    <div className="text-slate-500 flex justify-center items-center h-40">No homework found.</div>
                )}
            </div>
        </div>
    );
}
