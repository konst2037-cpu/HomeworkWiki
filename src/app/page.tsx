'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { School } from "@/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// const schools: School[] = [
//   { id: "1", name: "Greenwood High School" },
//   { id: "2", name: "Riverdale Academy" },
//   { id: "3", name: "Sunrise Public School" },
//   { id: "4", name: "Hilltop International" },
//   { id: "5", name: "Maple Leaf School" },
// ];
const gradeLevels = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, label: i + 1 }));
const classChar = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
  { id: "d", label: "D" },
  { id: "e", label: "E" },
  { id: "f", label: "F" },
];

export default function Home() {
  const [openSchool, setOpenSchool] = React.useState(false);
  const [openGrade, setOpenGrade] = React.useState(false);
  const [openClass, setOpenClass] = React.useState(false);
  const [schoolName, setSchoolName] = React.useState<string | null>(null);
  const [gradeLevel, setGradeLevel] = React.useState<number | null>(null);
  const [classSection, setClassSection] = React.useState<string | null>(null);
  const [schools, setSchools] = React.useState<School[]>([]);


  const isSelectionValid = schoolName !== null && gradeLevel !== null && classSection !== null;

  React.useEffect(() => {
    fetch('/api/v1/schools')
      .then((res) => res.json())
      .then((data) => {
        // Handle the fetched school data
        setSchools(data);
      })
      .catch((error) => {
        console.error('Error fetching schools:', error);
      });
  }, []);

  React.useEffect(() => {
    if (classSection) {
      const userIdKey = "homework_user_id";
      let userId = localStorage.getItem(userIdKey);
      if (!userId) {
        // Use a fallback for crypto.randomUUID() for Safari/iOS
        const generateUUID = () => {
          if (window.crypto && (window.crypto.randomUUID as any)) {
            return window.crypto.randomUUID();
          }
          // Fallback UUID v4 generator
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        };
        userId = generateUUID();
        localStorage.setItem(userIdKey, userId);
      }
    }
  }, [classSection]);

  React.useEffect(() => {
    if (schoolName && gradeLevel && classSection) {
      localStorage.setItem("selected_school", schoolName);
      localStorage.setItem("selected_grade", gradeLevel.toString());
      localStorage.setItem("selected_class", classSection);
    }
  }, [schoolName, gradeLevel, classSection]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setSchoolName(localStorage.getItem("selected_school"));
      setGradeLevel(
        localStorage.getItem("selected_grade")
          ? Number(localStorage.getItem("selected_grade"))
          : null
      );
      setClassSection(localStorage.getItem("selected_class"));
    }
  }, []);

  return (
    <div className="md:h-full flex flex-col mt-10 justify-center items-center overflow-hidden gap-10">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-2xl md:justify-center">
        <Popover open={openSchool} onOpenChange={setOpenSchool}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSchool}
              className="w-full md:w-[200px] justify-between"
            >
              {schoolName
                ? schools.find((sch) => sch.name === schoolName)?.name
                : "Select School..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-fit p-0">
            <Command>
              <CommandInput placeholder="Search school..." className="h-9" />
              <CommandList>
                <CommandEmpty>No school found.</CommandEmpty>
                <CommandGroup>
                  {schools.map((sch) => (
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
        <Popover open={openGrade} onOpenChange={setOpenGrade}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openGrade}
              className="w-full md:w-fit justify-between"
              disabled={!schoolName}
            >
              {gradeLevel
                ? `Grade ${gradeLevel}`
                : "Select Grade..."}
              <ChevronsUpDown className="opacity-50" />
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
        <Popover open={openClass} onOpenChange={setOpenClass}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openClass}
              className="w-full md:w-fit justify-between"
              disabled={!gradeLevel}
            >
              {classSection
                ? `Class ${classChar.find((c) => c.id === classSection)?.label}`
                : "Select Class..."}
              <ChevronsUpDown className="opacity-50" />
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
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-2xl md:justify-center">
        <Button variant="default" className="w-full md:w-fit">
          <span
            onClick={() => {
              if (!isSelectionValid) {
                toast.warning("All fields are required!");
                return;
              }
              window.location.href = "/homework/create";
            }}
          >
            Enter HomeWork
          </span>
        </Button>
        <Button asChild variant="default" className="w-full md:w-fit">
          <span
            onClick={() => {
              if (!isSelectionValid) {
                toast.warning("All fields are required!");
                return;
              }
              window.location.href = "/homework/search";
            }}
          >
            Lookup HomeWork
          </span>
        </Button>
      </div>
    </div>
  );
}
