export type School = {
    id: string,
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
    updated_date: string
}