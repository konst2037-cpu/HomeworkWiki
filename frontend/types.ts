export type School = {
    id: number,
    name: string
}

export type GradeLevel = {
    id: number,
    name: string
}

export type ClassChar = {
    id: number,
    name: string
}

export type Homework = {
    id: number,
    subject: string,
    delivery_date: string,
    content: string,
    user_id: string,
    gpt_reasoning: string,
    gpt_status: string,
    created_date: string,
    updated_date: string,
    school_id: number,
    grade_id: number,
    class_id: number
}