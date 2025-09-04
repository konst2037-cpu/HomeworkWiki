import HomeworkSearchPage from "@/components/homework-search";
import { Homework } from "@/types";

async function getHomeworks(): Promise<Homework[]> {
    const res = await fetch('http://localhost:8000/api/v1/homeworks', { cache: "no-store" });
    if (!res.ok) {
        throw new Error('Failed to fetch homeworks');
    }
    return await res.json();
}

export default async function LookupPage() {
    let homeworks: Homework[] = [];
    let error: string | null = null;


    try {
        homeworks = await getHomeworks();
    } catch (err: unknown) {
        if (err instanceof Error) {
            error = err.message || "Unknown error";
        } else {
            error = "Unknown error";
        }
    }

    return (
        <div>
            <HomeworkSearchPage homeworks={homeworks} error={error} />
        </div>
    );
}
