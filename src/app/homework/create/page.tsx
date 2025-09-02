'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function HomeworkCreatePage() {
    const [open, setOpen] = React.useState(false);
    const [deliveryDate, setDeliveryDate] = React.useState<string | null>(null);
    const [subject, setSubject] = React.useState("");
    const [content, setContent] = React.useState("");
    const [userId, setUserId] = React.useState<string | null>(null);
    const [error, setError] = React.useState("");
    // const [schoolId, setSchoolId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const storedUserId = localStorage.getItem("homework_user_id");
        setUserId(storedUserId);
    }, []);

    // React.useEffect(() => {
    //     const storedSchoolId = localStorage.getItem("homework_school_id");
    //     setSchoolId(storedSchoolId);
    // }, []);

    const validate = () => {
        if (!subject.trim()) {
            setError("Subject is required.");
            return false;
        }
        if (!deliveryDate) {
            setError("Date is required.");
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
            toast.error(error);
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
            }),
        }).then(res => {
            if (res.ok) {
                window.location.href = `/homework/list/${deliveryDate}`;
            } else {
                toast.error("Failed to create homework.");
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-10">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Add Homework
            </h2>
            <div className="flex flex-col gap-6 w-full md:w-1/2">
                <div className="flex flex-col md:flex-row gap-6">
                    <Input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}></Input>
                    <div className="flex flex-col gap-3">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="w-full justify-between font-normal"
                                >
                                    {deliveryDate ? deliveryDate : "Select date"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={deliveryDate ? new Date(deliveryDate) : undefined}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        if (date) {
                                            setDeliveryDate(date.toISOString().split('T')[0]);
                                            setOpen(false);
                                        }
                                    }}
                                    disabled={(date) => {
                                        const today = new Date();
                                        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                        const end = new Date(start);
                                        end.setDate(start.getDate() + 13); // next two weeks (14 days including today)
                                        return date < start || date > end;
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Textarea placeholder="Enter homework details..." value={content} onChange={(e) => setContent(e.target.value)} />
                <div className="flex flex-col md:flex-row justify-center gap-3">
                    <Button
                        variant="default"
                        className="justify-center font-normal w-full md:w-fit md:px-10"
                        onClick={() => {
                            // Simulate homework creation (replace with actual API call if needed)
                            // After creation, redirect to homework list page

                            handleSubmit();
                        }}
                    >
                        Submit
                    </Button>
                    <Button variant="destructive" className="justify-center font-normal w-full md:w-fit md:px-10">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
