import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export type TaskFiltersType = {
  status: string[];
  priority: string[];
};

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BACKLOG"];
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

const statusLabels: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
  BACKLOG: "Backlog",
};

const priorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-rose-50 text-rose-700 border-rose-200",
};

const statusColors: Record<string, string> = {
  TODO: "bg-zinc-50 text-zinc-600 border-zinc-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  IN_REVIEW: "bg-violet-50 text-violet-700 border-violet-200",
  DONE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BACKLOG: "bg-zinc-50 text-zinc-500 border-zinc-200",
};

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
  onClear: () => void;
}

export const TaskFilters = ({
  filters,
  onChange,
  onClear,
}: TaskFiltersProps) => {
  const [open, setOpen] = useState(false);

  const toggle = (key: keyof TaskFiltersType, value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const hasFilters = filters.status.length > 0 || filters.priority.length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((p) => !p)}
          className={`h-8 text-xs border-zinc-200 gap-1.5 font-semibold ${open ? "border-violet-400 text-violet-600" : ""}`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {hasFilters && (
            <span className="ml-1 bg-violet-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
              {filters.status.length + filters.priority.length}
            </span>
          )}
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 text-xs text-zinc-400 hover:text-rose-500 gap-1 font-semibold"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {open && (
        <div className="absolute top-10 right-0 z-50 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 w-72 space-y-4">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle("status", s)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                    filters.status.includes(s)
                      ? "bg-violet-600 text-white border-violet-600"
                      : statusColors[s]
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Priority
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => toggle("priority", p)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                    filters.priority.includes(p)
                      ? "bg-violet-600 text-white border-violet-600"
                      : priorityColors[p]
                  }`}
                >
                  {priorityLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            className="w-full h-8 text-xs bg-violet-600 hover:bg-violet-700 font-bold"
            onClick={() => setOpen(false)}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
