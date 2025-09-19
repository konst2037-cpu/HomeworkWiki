"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
// import { gradeLevels, classChar } from "@/consts";
import { ClassChar, GradeLevel, School } from "@/types";
import { useFilters } from "@/contexts/FilterContext";
import { translations } from "@/consts";

interface HomeworkFiltersProps {
  schools: School[];
  setSchools: React.Dispatch<React.SetStateAction<School[]>>;
  grades: GradeLevel[];
  classes: ClassChar[];
}

export default function HomeworkFilters({
  schools,
  setSchools,
  grades,
  classes,
}: HomeworkFiltersProps) {
  const [openSchool, setOpenSchool] = React.useState(false);
  const [openGrade, setOpenGrade] = React.useState(false);
  const [openClass, setOpenClass] = React.useState(false);
  const [schoolName, setSchoolName] = React.useState<string | null>(null);
  const [gradeLevel, setGradeLevel] = React.useState<number | null>(null);
  const [classSection, setClassSection] = React.useState<string | null>(null);
  const [schoolId, setSchoolId] = React.useState<number | null>(null);
  const [classId, setClassId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { setFilters } = useFilters();

  // debounce search (300ms)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const searchSchools = (query: string) => {
    clearTimeout(timeoutRef.current ?? undefined);
    timeoutRef.current = setTimeout(async () => {
      if (!query) {
        setSchools([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/schools?q=${encodeURIComponent(query)}&limit=25`,
        );
        const data = await res.json();
        setSchools(data);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const setLocalStorageItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  React.useEffect(() => {
    setSchoolName(localStorage.getItem("homework_school"));
    setGradeLevel(
      localStorage.getItem("homework_grade")
        ? Number(localStorage.getItem("homework_grade"))
        : null,
    );
    setClassSection(localStorage.getItem("homework_class"));
    setSchoolId(
      localStorage.getItem("homework_school_id")
        ? Number(localStorage.getItem("homework_school_id"))
        : null,
    );
    setClassId(
      localStorage.getItem("homework_class_id")
        ? Number(localStorage.getItem("homework_class_id"))
        : null,
    );
  }, []);

  React.useEffect(() => {
    setFilters({
      school_id: schoolId,
      grade_id: gradeLevel,
      class_id: classId,
      className: classSection,
      schoolName: schoolName,
    });
  }, [schoolId, gradeLevel, classId, classSection, schoolName, setFilters]);

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center w-full md:w-1/2">
      <Popover open={openSchool} onOpenChange={setOpenSchool}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSchool}
            className="w-full md:min-w-1/2 md:max-w-fit justify-between"
          >
            {schoolName || translations.SelectSchool}
            <ChevronsUpDown className="opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[220px] md:w-[240px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={translations.SearchSchool}
              className="h-9"
              required
              onValueChange={searchSchools}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? translations.Loading : translations.NoSchoolsFound}
              </CommandEmpty>
              <CommandGroup>
                {schools?.map((sch) => (
                  <CommandItem
                    key={sch.id}
                    value={sch.name}
                    onSelect={(currentSchool) => {
                      setSchoolName(currentSchool);
                      setLocalStorageItem("homework_school", currentSchool);
                      setLocalStorageItem(
                        "homework_school_id",
                        sch.id.toString(),
                      );
                      setOpenSchool(false);
                      setSchoolId(sch.id);
                    }}
                  >
                    {sch.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        schoolName === sch.name ? "opacity-100" : "opacity-0",
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
            className="w-full md:min-w-1/2 md:max-w-fit justify-between"
          >
            {gradeLevel
              ? `${translations.Grade} ${gradeLevel}`
              : translations.SelectGrade}
            <ChevronsUpDown className="opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[180px] md:w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={translations.SearchGrade}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>{translations.NoGradesFound}</CommandEmpty>
              <CommandGroup>
                {grades?.map((grade) => (
                  <CommandItem
                    key={grade.id}
                    value={grade.name.toString()}
                    onSelect={() => {
                      setGradeLevel(grade.id);
                      setLocalStorageItem(
                        "homework_grade",
                        grade.id.toString(),
                      );
                      setOpenGrade(false);
                    }}
                  >
                    {`${translations.Grade} ${grade.name}`}
                    <Check
                      className={cn(
                        "ml-auto",
                        gradeLevel?.toString() === grade.name
                          ? "opacity-100"
                          : "opacity-0",
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
            className="w-full md:min-w-1/2 md:max-w-fit justify-between"
          >
            {classSection
              ? `${translations.Class} ${classes.find((c) => c.name === classSection)?.name}`
              : translations.SelectClass}
            <ChevronsUpDown className="opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[140px] md:w-[160px] p-0">
          <Command>
            <CommandInput
              placeholder={translations.SearchClass}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>{translations.NoClassesFound}</CommandEmpty>
              <CommandGroup>
                {classes?.map((section) => (
                  <CommandItem
                    key={section.id}
                    value={section.name}
                    onSelect={() => {
                      setClassSection(section.name);
                      setLocalStorageItem("homework_class", section.name);
                      setLocalStorageItem(
                        "homework_class_id",
                        section.id.toString(),
                      );
                      setOpenClass(false);
                      setClassId(section.id);
                    }}
                  >
                    {`${translations.Class} ${section.name}`}
                    <Check
                      className={cn(
                        "ml-auto",
                        classSection === section.name
                          ? "opacity-100"
                          : "opacity-0",
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
