import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import type { WorkspaceMember } from "@/api/types";

export type TaskFiltersType = {
  status: string[];
  priority: string[];
  dueDate?: string;
  createdAt?: string;
  assignedTo?: string;
  createdBy?: string;
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

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
  onClear: () => void;
  members?: WorkspaceMember[];
}

export const TaskFilters = ({
  filters,
  onChange,
  onClear,
  members = [],
}: TaskFiltersProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (key: "status" | "priority", value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const activeCount =
    filters.status.length +
    filters.priority.length +
    (filters.dueDate ? 1 : 0) +
    (filters.createdAt ? 1 : 0) +
    (filters.assignedTo ? 1 : 0) +
    (filters.createdBy ? 1 : 0);

  const hasFilters = activeCount > 0;

  return (
    <div className="relative" ref={ref}>
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
              {activeCount}
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
        <div className="absolute top-10 right-0 z-50 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 w-72 space-y-4 max-h-[80vh] overflow-y-auto">
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
                      ? "bg-zinc-800 text-white border-zinc-800"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
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
                      ? "bg-zinc-800 text-white border-zinc-800"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {priorityLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Due Date
            </p>
            <input
              type="date"
              value={filters.dueDate || ""}
              onChange={(e) =>
                onChange({ ...filters, dueDate: e.target.value || undefined })
              }
              className="w-full border border-zinc-200 rounded-md px-3 py-1.5 text-xs text-zinc-700 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Created At
            </p>
            <input
              type="date"
              value={filters.createdAt || ""}
              onChange={(e) =>
                onChange({ ...filters, createdAt: e.target.value || undefined })
              }
              className="w-full border border-zinc-200 rounded-md px-3 py-1.5 text-xs text-zinc-700 outline-none focus:border-zinc-400"
            />
          </div>

          {members.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Assigned To
              </p>
              <select
                value={filters.assignedTo || ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    assignedTo: e.target.value || undefined,
                  })
                }
                className="w-full border border-zinc-200 rounded-md px-3 py-1.5 text-xs text-zinc-700 outline-none focus:border-zinc-400 bg-white"
              >
                <option value="">Anyone</option>
                {members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name ?? m.user.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {members.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Created By
              </p>
              <select
                value={filters.createdBy || ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    createdBy: e.target.value || undefined,
                  })
                }
                className="w-full border border-zinc-200 rounded-md px-3 py-1.5 text-xs text-zinc-700 outline-none focus:border-zinc-400 bg-white"
              >
                <option value="">Anyone</option>
                {members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name ?? m.user.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            size="sm"
            className="w-full h-8 text-xs bg-zinc-800 hover:bg-zinc-900 text-white font-bold"
            onClick={() => setOpen(false)}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
