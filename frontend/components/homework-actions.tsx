"use client";

import { Homework } from "@/types";
import { BookCheck, BookX, EllipsisVertical } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./ui/label";

export function HomeworkActions({
  homework,
  statusMap,
  setStatusMap,
}: {
  homework: Homework;
  statusMap: { [key: string]: "finish" | "false" };
  setStatusMap: React.Dispatch<
    React.SetStateAction<{ [key: string]: "finish" | "false" }>
  >;
}) {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedUserId = localStorage.getItem("homework_user_id");
    setUserId(storedUserId);
  }, []);

  function setHomeworkStatus(id: string, status: "finish" | "false") {
    if (status !== null) {
      const prev = JSON.parse(localStorage.getItem("homework_status") || "{}");
      localStorage.setItem(
        "homework_status",
        JSON.stringify({ ...prev, [id]: status }),
      );
      setStatusMap({ ...statusMap, [id]: status });
    }
  }

  function reportFalseHomework() {
    fetch("/api/v1/false_reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homework_id: homework.id, user_id: userId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("Failed to report false homework:", error);
      });
  }

  return (
    <div className="flex justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <EllipsisVertical />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="w-full text-green-600 hover:bg-green-50"
              onClick={() =>
                setHomeworkStatus(homework.id.toString(), "finish")
              }
              aria-label="Mark as Finished"
            >
              <Label className="cursor-pointer">
                <BookCheck /> Finished
              </Label>
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-red-600 hover:bg-red-50"
              onClick={() => {
                setHomeworkStatus(homework.id.toString(), "false");
                reportFalseHomework();
              }}
              aria-label="Mark as False"
            >
              <Label className="cursor-pointer">
                <BookX /> False
              </Label>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
