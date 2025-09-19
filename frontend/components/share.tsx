import { toast } from "sonner";
import { Button } from "./ui/button";
import { Copy, Share } from "lucide-react";
import { useFilters } from "@/contexts/FilterContext";
import React from "react";

export function ShareButton() {
  const { filters, setFilters } = useFilters();

  const shareUrl = () => {
    const currentUrl = window.location.href;
    const params = new URLSearchParams();
    if (filters.school_id)
      params.set("school_id", filters.school_id.toString());
    if (filters.grade_id) params.set("grade_id", filters.grade_id.toString());
    if (filters.class_id) params.set("class_id", filters.class_id.toString());
    if (filters.className) params.set("class", filters.className.toString());
    if (filters.schoolName) params.set("school", filters.schoolName.toString());
    return `${currentUrl.split("?")[0]}?${params.toString()}`;
  };

  // Set all filters from shared link parameters on page load.
  // This allows users to view homeworks directly without manually selecting school, grade, or class.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setFilters((prev) => ({
      school_id: params.has("school_id")
        ? Number(params.get("school_id"))
        : prev.school_id,
      grade_id: params.has("grade_id")
        ? Number(params.get("grade_id"))
        : prev.grade_id,
      class_id: params.has("class_id")
        ? Number(params.get("class_id"))
        : prev.class_id,
      schoolName: params.has("school")
        ? (params.get("school") ?? prev.schoolName)
        : prev.schoolName,
      className: params.has("class")
        ? (params.get("class") ?? prev.className)
        : prev.className,
    }));

    if (params.has("school_id"))
      localStorage.setItem("homework_school_id", params.get("school_id")!);
    if (params.has("grade_id"))
      localStorage.setItem("homework_grade", params.get("grade_id")!);
    if (params.has("class_id"))
      localStorage.setItem("homework_class_id", params.get("class_id")!);
    if (params.has("school"))
      localStorage.setItem("homework_school", params.get("school")!);
    if (params.has("class"))
      localStorage.setItem("homework_class", params.get("class")!);
  }, []);
  return (
    <div className="flex justify-end w-full md:max-w-4xl gap-2">
      <Button
        variant="outline"
        className="cursor-pointer my-2 flex items-center gap-2 border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all shadow-sm"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl());
          toast.info("Homework link copied!");
        }}
      >
        <Copy className="w-4 h-4" />
        <span className="font-medium">Link</span>
      </Button>
      <Button
        variant="outline"
        className="cursor-pointer my-2 flex items-center gap-2 border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all shadow-sm"
        onClick={() => {
          navigator.share?.({
            title: "Homework Link",
            text: "Check out this homework link!",
            url: shareUrl(),
          });
        }}
      >
        <Share className="w-4 h-4" />
        <span className="font-medium">Share</span>
      </Button>
    </div>
  );
}
