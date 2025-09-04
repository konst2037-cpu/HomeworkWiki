'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { gradeLevels, classChar } from "@/consts";
import { School } from "@/types";
import { useFilters } from "@/contexts/FilterContext";

interface HomeworkFiltersProps {
    schools: School[];
}

export default function HomeworkFilters({ schools }: HomeworkFiltersProps) {
    const [openSchool, setOpenSchool] = React.useState(false);
    const [openGrade, setOpenGrade] = React.useState(false);
    const [openClass, setOpenClass] = React.useState(false);
    const [schoolName, setSchoolName] = React.useState<string | null>(null);
    const [gradeLevel, setGradeLevel] = React.useState<number | null>(null);
    const [classSection, setClassSection] = React.useState<string | null>(null);
    const [schoolId, setSchoolId] = React.useState<number | null>(null);
    const [classId, setClassId] = React.useState<number | null>(null);

    const { filters, setFilters } = useFilters();

    const setLocalStorageItem = (key: string, value: string) => {
        localStorage.setItem(key, value);
    };

    React.useEffect(() => {
        setSchoolName(localStorage.getItem("homework_school"));
        setGradeLevel(
            localStorage.getItem("homework_grade")
                ? Number(localStorage.getItem("homework_grade"))
                : null
        );
        setClassSection(localStorage.getItem("homework_class"));
        setSchoolId(
            localStorage.getItem("homework_school_id")
                ? Number(localStorage.getItem("homework_school_id"))
                : null
        );
        setClassId(
            localStorage.getItem("homework_class_id")
                ? Number(localStorage.getItem("homework_class_id"))
                : null
        );
    }, []);

    React.useEffect(() => {
        setFilters({ school_id: schoolId, grade_id: gradeLevel, class_id: classId });
    }, [schoolId, gradeLevel, classId]);

    return (
        <div className="flex flex-col md:flex-row gap-2 justify-center w-full md:w-1/2">
            <Popover open={openSchool} onOpenChange={setOpenSchool}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSchool}
                        className="w-full md:w-1/2 justify-between"
                    >
                        {schoolName
                            ? schools.find((sch) => sch.name === schoolName)?.name
                            : "Select School"}
                        <ChevronsUpDown className="opacity-50 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[220px] md:w-[240px] p-0">
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
                                            setSchoolName(currentSchool);
                                            setLocalStorageItem('homework_school', currentSchool);
                                            setLocalStorageItem('homework_school_id', sch.id.toString());
                                            setOpenSchool(false);
                                            setSchoolId(sch.id);
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
            <Popover open={openGrade} onOpenChange={setOpenGrade}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openGrade}
                        className="w-full md:w-1/2 justify-between"
                    >
                        {gradeLevel
                            ? `Grade ${gradeLevel}`
                            : "Select Grade"}
                        <ChevronsUpDown className="opacity-50 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[180px] md:w-[200px] p-0">
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
                                            setLocalStorageItem('homework_grade', grade.id.toString());
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
            <Popover open={openClass} onOpenChange={setOpenClass}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClass}
                        className="w-full md:w-1/2 justify-between"
                    >
                        {classSection
                            ? `Class ${classChar.find((c) => c.label === classSection)?.label}`
                            : "Select Class"}
                        <ChevronsUpDown className="opacity-50 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[140px] md:w-[160px] p-0">
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
                                            setClassSection(section.label);
                                            setLocalStorageItem('homework_class', section.label);
                                            setLocalStorageItem('homework_class_id', section.id.toString());
                                            setOpenClass(false);
                                            setClassId(section.id);
                                        }}
                                    >
                                        {`Class ${section.label}`}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                classSection === section.label ? "opacity-100" : "opacity-0"
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
    );
}
