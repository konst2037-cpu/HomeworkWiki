'use client'

import { EllipsisVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

export default function Homework({ subject, content }: { subject: string; content: string }) {
    return (
        <div className="grid grid-cols-[1fr_auto_2fr_auto_auto] items-center gap-3 justify-center mx-5 md:mx-10 bg-gray-100 px-2 py-1">
            <p>
                {subject}
            </p>
            <Separator orientation="vertical" />
            <p className="text-wrap">
                {content}
            </p>
            <Separator orientation="vertical" />
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <EllipsisVertical />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                        <div className="flex flex-col gap-2">
                            <p>Finished</p>
                            <p>False</p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}