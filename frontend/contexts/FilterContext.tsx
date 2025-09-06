"use client"

import React, { createContext, useContext, useState } from "react"

type Filters = {
    school_id: number | null
    grade_id: number | null
    class_id: number | null
    schoolName: string | null
    className: string | null
}

type FilterContextType = {
    filters: Filters
    setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFilters] = useState<Filters>(() => {
        if (typeof window !== "undefined") {
            const storedSchoolId = localStorage.getItem("homework_school_id");
            const storedGradeId = localStorage.getItem("homework_grade_id");
            const storedClassId = localStorage.getItem("homework_class_id");
            const storedSchoolName = localStorage.getItem("homework_school");
            const storedClassName = localStorage.getItem("homework_class");

            return {
                school_id: storedSchoolId ? Number(storedSchoolId) : null,
                grade_id: storedGradeId ? Number(storedGradeId) : null,
                class_id: storedClassId ? Number(storedClassId) : null,
                schoolName: storedSchoolName,
                className: storedClassName,
            }
        }
        return {
            school_id: null,
            grade_id: null,
            class_id: null,
            schoolName: null,
            className: null,
        }
    });

    React.useEffect(() => {
        if (filters.school_id !== null)
            localStorage.setItem("homework_school_id", String(filters.school_id));


        if (filters.grade_id !== null)
            localStorage.setItem("homework_grade", String(filters.grade_id));

        if (filters.class_id !== null)
            localStorage.setItem("homework_class_id", String(filters.class_id));

        if (filters.schoolName !== null)
            localStorage.setItem("homework_school", filters.schoolName);

        if (filters.className !== null)
            localStorage.setItem("homework_class", filters.className)
    }, [filters]);

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    )
}

// Custom hook
export const useFilters = () => {
    const ctx = useContext(FilterContext)
    if (!ctx) throw new Error("useFilters must be used inside FilterProvider")
    return ctx
}
