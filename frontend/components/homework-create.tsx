'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import React from "react";
import { useFilters } from "@/contexts/FilterContext";


export default function HomeworkCreatePage() {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [deliveryDate, setDeliveryDate] = React.useState<string | null>(null);
    const [subject, setSubject] = React.useState("");
    const [content, setContent] = React.useState("");
    const [userId, setUserId] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>("All fields are required.");
    const { filters, setFilters } = useFilters();
    const [loading, setLoading] = React.useState(false);


    React.useEffect(() => {
        const storedUserId = localStorage.getItem("homework_user_id");
        setUserId(storedUserId);
    }, []);

    React.useEffect(() => {
        setDeliveryDate(date ? `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}` : null);
    }, [date]);

    const validate = () => {
        if (!deliveryDate) {
            setError("Date is required.");
            return false;
        }

        if (!subject.trim()) {
            setError("Subject is required.");
            return false;
        }

        if (!content.trim()) {
            setError("Content is required.");
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = () => {

        if (!validate()) {
            if (error) {
                toast.error(error);
                setLoading(false);
            }
            return;
        }

        fetch("/api/v1/homeworks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject,
                delivery_date: deliveryDate,
                content,
                user_id: userId,
                school_id: filters.school_id,
                class_id: filters.class_id,
                grade_id: filters.grade_id
            }),
        }).then(res => {
            if (res.status === 422) {
                res.json().then(data => {
                    console.log(data);
                    toast.error(data?.detail || "Validation error. Please check your input.");
                });
            } else if (res.ok) {
                window.location.href = `/homework/list/${deliveryDate}`;
            } else {
                toast.error("Failed to create homework.");
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className="flex flex-col h-full items-center gap-10 px-4">
            <h2 className="scroll-m-20 border-b pb-2 text-xl md:text-2xl md:font-semibold tracking-tight first:mt-0">
                Post Homework
            </h2>
            <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
                onSubmit={e => {
                    setLoading(true);
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="flex flex-col md:flex-row gap-2 md:col-span-2">
                    <div className="flex flex-col gap-2">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="w-full font-normal justify-between"
                                >
                                    {deliveryDate ? deliveryDate : "Select delivery date"}
                                    <ChevronDownIcon className="ml-2" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        console.log(date);
                                        setDate(date)
                                        setOpen(false)
                                    }}
                                    disabled={(date) => {
                                        const today = new Date();
                                        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                        const end = new Date(start);
                                        end.setDate(start.getDate() + 27);
                                        return date < start || date > end;
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col md:col-span-2">

                    <Textarea
                        placeholder="Enter homework details..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full"
                    />

                </div>
                <div className="flex gap-4 md:col-span-2 justify-end mt-4 items-center">
                    {loading && (
                        <LoaderCircle className="animate-spin h-6 w-6 text-primary items-center" />
                    )}
                    <Button
                        variant="default"
                        className="font-normal px-10"
                        type="submit"
                        style={{ cursor: "pointer" }}
                    >
                        Submit
                    </Button>
                    <Link href="/">
                        <Button variant="destructive" style={{ cursor: "pointer" }} className="font-normal px-10">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
