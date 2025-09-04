import Home from "@/components/homework-home";
import { Homework, School } from "@/types";
import { Suspense } from "react";

async function getSchools(): Promise<School[]> {
  const res = await fetch('http://localhost:8000/api/v1/schools', { cache: "no-store" });
  if (!res.ok) {
    throw new Error('Failed to fetch schools');
  }
  return await res.json();
}


export default async function Page() {
  let schools: School[] = [];
  let error: string | null = null;

  try {
    schools = await getSchools();
  } catch (err: any) {
    error = err.message || "Unknown error";
  }


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home schools={schools} error={error} />
    </Suspense>
  );
}
