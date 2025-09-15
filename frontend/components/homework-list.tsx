'use client'

import { useFilters } from "@/contexts/FilterContext";
import { Homework } from "@/types";
import { ArrowBigLeft, ArrowBigRight, BookCheck, BookX, ChevronLeft, ChevronRight, EllipsisVertical, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { ShareButton } from "./share";

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
    const { filters } = useFilters();
    const [offset, setOffset] = React.useState(0);
    const [limit, setLimit] = React.useState(50);
    const [homeworkCount, setHomeworkCount] = React.useState(0);
    const [statusMap, setStatusMap] = React.useState<{ [key: string]: "finish" | "false" }>({});

    // Load homework status from localStorage
    React.useEffect(() => {
        const storedStatus = localStorage.getItem("homework_status");
        if (storedStatus) {
            setStatusMap(JSON.parse(storedStatus));
        }
    }, []);


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
        params.append("offset", offset.toString());
        params.append("limit", limit.toString());

        fetch(`/api/v1/homeworks?${params.toString()}`)
            .then(async res => {
                if (!res.ok) {
                    const errorMsg = await res.text();
                    throw new Error(errorMsg || `HTTP error ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setHomeworks(data);
            })
            .catch(err => {
                toast.error("Failed to fetch homeworks.");
                console.error(err);
                setHomeworks([]);
            })
            .finally(() => setLoading(false));
    }, [currentDate, offset, limit, filters]);

    // Fetch all delivery dates
    React.useEffect(() => {

        const params = new URLSearchParams();

        if (filters.school_id) params.append("school_id", filters.school_id.toString());
        if (filters.grade_id) params.append("grade_id", filters.grade_id.toString());
        if (filters.class_id) params.append("class_id", filters.class_id.toString());

        fetch(`/api/v1/homeworks/stats?group_by=delivery_date&metric=distinct&${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                // const dates = Array.from(new Set(data.results.map((hw: Homework) => hw.delivery_date))) as string[];
                const dates = data.results;
                setDeliveryDates(dates);
            })
            .catch(() => setDeliveryDates([]));
    }, []);

    // Fetch all delivery dates
    React.useEffect(() => {
        if (!currentDate) return;

        const params = new URLSearchParams();

        if (filters.school_id) params.append("school_id", filters.school_id.toString());
        if (filters.grade_id) params.append("grade_id", filters.grade_id.toString());
        if (filters.class_id) params.append("class_id", filters.class_id.toString());
        params.append("metric", "count");
        params.append("delivery_date", currentDate);

        fetch(`/api/v1/homeworks/stats?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setHomeworkCount(data.results[0]?.count || 0);
            })
            .catch(() => setHomeworkCount(0));
    }, [currentDate, filters]);


    const currentIndex = deliveryDates.findIndex(date => date === currentDate);
    const prevDeliveryDate = deliveryDates[currentIndex - 1];
    const nextDeliveryDate = deliveryDates[currentIndex + 1];

    const handleNavigate = (date?: string) => {
        if (date) setCurrentDate(date);
    };

    function setHomeworkStatus(id: string, status: "finish" | "false") {
        if (status !== null) {
            const prev = JSON.parse(localStorage.getItem('homework_status') || '{}');
            localStorage.setItem(
                'homework_status',
                JSON.stringify({ ...prev, [id]: status })
            );
            setStatusMap({ ...statusMap, [id]: status });
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-10 justify-between">
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
            <div className="flex flex-col md:flex-row justify-between items-center md:gap-3 w-full">
                {homeworkCount > limit && (
                    <div className="flex justify-center md:justify-between items-center gap-4 py-2">
                        <div className="inline-flex rounded-md gap-2" role="group">
                            <Button
                                variant="outline"
                                disabled={offset === 0}
                                onClick={() => setOffset(prev => Math.max(prev - limit, 0))}
                                className="rounded-l-md"
                            >
                                <ChevronLeft />
                            </Button>
                            {homeworkCount / limit > 4 ? (
                                <>
                                    <Button
                                        variant={offset / limit === 0 ? "default" : "outline"}
                                        onClick={() => setOffset(0)}
                                        className="px-3"
                                        disabled={offset / limit === 0}
                                    >
                                        1
                                    </Button>
                                    {/* {offset / limit > 3 && <span className="px-2">...</span>} */}
                                    {Array.from({ length: Math.min(2, Math.ceil(homeworkCount / limit) - 2) }, (_, idx) => {

                                        const page = Math.max(3, offset / limit - 2) + idx;

                                        // -1 to avoid duplicate number in page button
                                        if (page >= Math.ceil(homeworkCount / limit) - 1) return null;

                                        return (
                                            <Button
                                                key={page}
                                                variant={offset / limit === page ? "default" : "outline"}
                                                onClick={() => setOffset(page * limit)}
                                                className={`px-3 -ml-px`}
                                                disabled={offset / limit === page}
                                            >
                                                {page + 1}
                                            </Button>
                                        );
                                    })}
                                    {/* {offset / limit < Math.ceil(homeworkCount / limit) - 4 && <span className="px-2">...</span>} */}
                                    <Button
                                        variant={offset / limit === Math.ceil(homeworkCount / limit) - 1 ? "default" : "outline"}
                                        onClick={() => setOffset((Math.ceil(homeworkCount / limit) - 1) * limit)}
                                        className="px-3 -ml-px rounded-r-md"
                                        disabled={offset / limit === Math.ceil(homeworkCount / limit) - 1}
                                    >
                                        {Math.ceil(homeworkCount / limit)}
                                    </Button>
                                </>
                            ) : (
                                Array.from({ length: Math.ceil(homeworkCount / limit) }, (_, i) => (
                                    <Button
                                        key={i}
                                        variant={offset / limit === i ? "default" : "outline"}
                                        onClick={() => setOffset(i * limit)}
                                        className={`px-3 ${i === 0 ? "" : "-ml-px"} ${i === Math.ceil(homeworkCount / limit) - 1 ? "rounded-r-md" : ""}`}
                                        disabled={offset / limit === i}
                                    >
                                        {i + 1}
                                    </Button>
                                ))
                            )}
                            <Button
                                variant="outline"
                                disabled={offset + limit >= homeworkCount}
                                onClick={() => setOffset(prev => prev + limit)}
                                className="rounded-r-md -ml-px"
                            >
                                <ChevronRight />
                            </Button>
                        </div>

                        <span className="text-slate-600 text-sm">
                            Page {Math.floor(offset / limit) + 1} of {Math.max(1, Math.ceil(homeworkCount / limit))}
                        </span>
                    </div>
                )}

                <div className="flex gap-2 justify-between w-full md:w-auto">
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
                        Total: <Badge className="bg-cyan-500 text-white">{homeworkCount}</Badge>
                    </Button>
                </div>

            </div>
            {/* <div className="flex flex-col gap-1 py-2 overflow-y-auto max-h-[60vh]">
                {loading ? (
                    <div className="text-slate-500 flex justify-center items-center h-40">Loading...</div>
                ) : Array.isArray(homeworks) && homeworks.length > 0 ? (
                    homeworks.map((hw) => (

                        <HomeworkComp key={hw.id} subject={hw.subject} content={hw.content} id={hw.id} />
                    ))
                ) : (
                    <div className="text-slate-500 flex justify-center items-center h-40">No homework found.</div>
                )}
            </div> */}

            <div className="overflow-hidden rounded-md border">
                <Table className="table-fixed w-full">
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead className="w-[12vw] max-w-[120px]">Subject</TableHead>
                            <TableHead className="w-[40vw]">Content</TableHead>
                            <TableHead className="text-right w-[7vw] max-w-[120px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <div className="overflow-y-auto md:max-h-[60vh] max-h-[45vh]">
                    <Table>
                        <TableBody>
                            {homeworks.map((hw) => (
                                <TableRow
                                    key={hw.id}
                                    className={cn(
                                        statusMap[hw.id] === "finish" && "bg-green-50",
                                        statusMap[hw.id] === "false" && "bg-red-50"
                                    )}
                                >
                                    <TableCell className="font-medium w-[12vw] max-w-[120px] truncate">{hw.subject}</TableCell>
                                    <TableCell className="whitespace-normal w-[40vw]">{hw.content}</TableCell>
                                    <TableCell className="text-right w-[7vw] max-w-[120px]">
                                        <div className="flex justify-end">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <EllipsisVertical />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-1">
                                                    <div className="flex flex-col gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full text-green-600 hover:bg-green-50"
                                                            onClick={() =>
                                                                setHomeworkStatus(hw.id.toString(), "finish")
                                                            }
                                                            aria-label="Mark as Finished"
                                                        >
                                                            <Label className="cursor-pointer"><BookCheck /> Finished</Label>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="justify-start w-full text-red-600 hover:bg-red-50"
                                                            onClick={() =>
                                                                setHomeworkStatus(hw.id.toString(), "false")
                                                            }
                                                            aria-label="Mark as False"
                                                        >
                                                            <Label className="cursor-pointer"><BookX /> False</Label>
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <ShareButton />
        </div >
    );
}
