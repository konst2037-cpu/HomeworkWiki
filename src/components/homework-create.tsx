'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { School } from "@/types";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { gradeLevels, classChar } from "@/consts";
import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface HomeworkCreatePageProps {
    schools: School[];
}

export default function HomeworkCreatePage({ schools }: HomeworkCreatePageProps) {
    const [open, setOpen] = React.useState(false);
    const [openSchool, setOpenSchool] = React.useState(false);
    const [openGrade, setOpenGrade] = React.useState(false);
    const [openClass, setOpenClass] = React.useState(false);
    const [schoolName, setSchoolName] = React.useState<string | null>(null);
    const [gradeLevel, setGradeLevel] = React.useState<number | null>(null);
    const [classSection, setClassSection] = React.useState<string | null>(null);
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [deliveryDate, setDeliveryDate] = React.useState<string | null>(null);
    const [subject, setSubject] = React.useState("");
    const [content, setContent] = React.useState("");
    const [userId, setUserId] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>("All fields are required.");
    const [openItem, setOpenItem] = React.useState<string>("");


    const isAllSchoolDetailsFilled = () => {
        return schoolName && gradeLevel && classSection;
    };


    React.useEffect(() => {
        const storedUserId = localStorage.getItem("homework_user_id");
        const storedSchoolName = localStorage.getItem("filtered_school");
        const storedGradeLevel = localStorage.getItem("filtered_grade");
        const storedClassSection = localStorage.getItem("filtered_class");
        setUserId(storedUserId);
        setSchoolName(storedSchoolName);
        setGradeLevel(storedGradeLevel ? parseInt(storedGradeLevel) : null);
        setClassSection(storedClassSection);
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
        if (!isAllSchoolDetailsFilled()) {
            toast.error("Please fill in all school details.");
            setOpenItem("item-1");
            return;
        }

        if (!validate()) {
            if (error) {
                toast.error(error);
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
        <div className="flex flex-col items-center justify-center h-full gap-10 px-4">
            <h2 className="scroll-m-20 border-b pb-2 text-xl md:text-3xl md:font-semibold tracking-tight first:mt-0">
                Add Homework
            </h2>
            <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <Accordion type="single" className="md:col-span-2" value={openItem} onValueChange={setOpenItem}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="w-full">Do you want to change school details?</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Popover open={openSchool} onOpenChange={setOpenSchool}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openSchool}
                                            className="w-full font-normal justify-between"
                                        >
                                            {schoolName
                                                ? schools.find((sch) => sch.name === schoolName)?.name
                                                : "Select School"}
                                            <ChevronsUpDown className="opacity-50 ml-2" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full md:w-fit p-0">
                                        <Command>
                                            <CommandInput placeholder="Search school..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No school found.</CommandEmpty>
                                                <CommandGroup>
                                                    {schools?.map((sch) => (
                                                        <CommandItem
                                                            key={sch.id}
                                                            value={sch.name}
                                                            onSelect={(currentSchool) => {
                                                                setSchoolName(currentSchool)
                                                                setOpenSchool(false)
                                                            }}
                                                        >
                                                            {sch.name}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    schoolName === sch.name ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Popover open={openGrade} onOpenChange={setOpenGrade}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openGrade}
                                            className="w-full font-normal justify-between"
                                        >
                                            {gradeLevel
                                                ? `Grade ${gradeLevel}`
                                                : "Select Grade"}
                                            <ChevronsUpDown className="opacity-50 ml-2" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full md:w-fit p-0">
                                        <Command>
                                            <CommandInput placeholder="Search grade..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No grade found.</CommandEmpty>
                                                <CommandGroup>
                                                    {gradeLevels.map((grade) => (
                                                        <CommandItem
                                                            key={grade.id}
                                                            value={grade.label.toString()}
                                                            onSelect={() => {
                                                                setGradeLevel(grade.id);
                                                                setOpenGrade(false);
                                                            }}
                                                        >
                                                            {`Grade ${grade.label}`}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    gradeLevel === grade.label ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Popover open={openClass} onOpenChange={setOpenClass}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openClass}
                                            className="w-full font-normal justify-between"
                                        >
                                            {classSection
                                                ? `Class ${classChar.find((c) => c.id === classSection)?.label}`
                                                : "Select Class"}
                                            <ChevronsUpDown className="opacity-50 ml-2" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full md:w-fit p-0">
                                        <Command>
                                            <CommandInput placeholder="Search class..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No class found.</CommandEmpty>
                                                <CommandGroup>
                                                    {classChar.map((section) => (
                                                        <CommandItem
                                                            key={section.id}
                                                            value={section.label}
                                                            onSelect={() => {
                                                                setClassSection(section.id);
                                                                setOpenClass(false);
                                                            }}
                                                        >
                                                            {`Class ${section.label}`}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    classSection === section.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

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
                                        setDate(date)
                                        setOpen(false)
                                    }}
                                    disabled={(date) => {
                                        const today = new Date();
                                        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                        const end = new Date(start);
                                        end.setDate(start.getDate() + 13);
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
                <div className="flex flex-col gap-2 md:col-span-2">

                    <Textarea
                        placeholder="Enter homework details..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full"
                    />

                </div>
                <div className="flex gap-4 md:col-span-2 justify-end mt-4">
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
