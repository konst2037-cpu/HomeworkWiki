"use client"

import React, { createContext, useContext, useState } from "react"

type Filters = {
    school_id: number | null
    grade_id: number | null
    class_id: number | null
}

type FilterContextType = {
    filters: Filters
    setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFilters] = useState<Filters>({
        school_id: null,
        grade_id: null,
        class_id: null,
    })

    React.useEffect(() => {
        const storedSchoolId = localStorage.getItem("homework_school_id");
        const storedGradeId = localStorage.getItem("homework_grade_id");
        const storedClassId = localStorage.getItem("homework_class_id");

        setFilters({
            school_id: storedSchoolId ? Number(storedSchoolId) : null,
            grade_id: storedGradeId ? Number(storedGradeId) : null,
            class_id: storedClassId ? Number(storedClassId) : null,
        });
    }, []);

    React.useEffect(() => {
        if (filters.school_id !== null)
            localStorage.setItem("homework_school_id", String(filters.school_id));
        else
            localStorage.removeItem("homework_school_id");

        if (filters.grade_id !== null)
            localStorage.setItem("homework_grade_id", String(filters.grade_id));
        else
            localStorage.removeItem("homework_grade_id");

        if (filters.class_id !== null)
            localStorage.setItem("homework_class_id", String(filters.class_id));
        else
            localStorage.removeItem("homework_class_id");
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
