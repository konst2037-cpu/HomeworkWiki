"use client";

import { EllipsisVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

export default function Homework({
  id,
  subject,
  content,
}: {
  id: number;
  subject: string;
  content: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<"finished" | "false" | null>(null);

  React.useEffect(() => {
    if (status !== null) {
      const prev = JSON.parse(localStorage.getItem("homework_status") || "{}");
      localStorage.setItem(
        "homework_status",
        JSON.stringify({ ...prev, [id]: status }),
      );
    }
  }, [status, id]);

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_2fr_auto_auto] items-center gap-3 justify-center mx-5 md:mx-10 px-2 py-1",
        status === "finished"
          ? "bg-green-100"
          : status === "false"
            ? "bg-red-100"
            : "bg-gray-100",
      )}
    >
      <p>{subject}</p>
      <Separator orientation="vertical" />
      <p className="text-wrap">{content}</p>
      <Separator orientation="vertical" />
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <EllipsisVertical />
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <div className="flex flex-col gap-1">
              <div
                className="hover:bg-gray-200 p-2 rounded cursor-pointer"
                onClick={() => {
                  setStatus("finished");
                }}
              >
                <Label>Finished</Label>
              </div>
              <div
                className="hover:bg-gray-200 p-2 rounded cursor-pointer"
                onClick={() => {
                  setStatus("false");
                }}
              >
                <Label>False</Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
