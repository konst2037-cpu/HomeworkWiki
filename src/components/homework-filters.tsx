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

    const setLocalStorageItem = (key: string, value: string) => {
        localStorage.setItem(key, value);
    };

    React.useEffect(() => {
        setSchoolName(localStorage.getItem("filtered_school"));
        setGradeLevel(
            localStorage.getItem("filtered_grade")
                ? Number(localStorage.getItem("filtered_grade"))
                : null
        );
        setClassSection(localStorage.getItem("filtered_class"));
    }, []);

    return (
        <div className="flex flex-wrap gap-2 w-full justify-center items-center py-2">
            <Popover open={openSchool} onOpenChange={setOpenSchool}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSchool}
                        className="flex-1 min-w-[140px] sm:min-w-[180px] md:min-w-[200px] justify-between"
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
                                            setLocalStorageItem('filtered_school', currentSchool);
                                            setOpenSchool(false);
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
                        className="flex-1 min-w-[120px] sm:min-w-[150px] md:min-w-[170px] justify-between"
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
                                            setLocalStorageItem('filtered_grade', grade.id.toString());
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
                        className="flex-1 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] justify-between"
                    >
                        {classSection
                            ? `Class ${classChar.find((c) => c.id === classSection)?.label}`
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
                                            setClassSection(section.id);
                                            setLocalStorageItem('filtered_class', section.id);
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
    );
}
