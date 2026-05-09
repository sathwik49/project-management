import {
  CheckCircle2,
  Clock,
  User,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { TaskWithDetails } from "@/api/types";

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  isDeleting,
}: {
  task: TaskWithDetails;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) => (
  <div className="group bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-4 hover:border-violet-300 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
          {task.status === "DONE" && (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          )}
          {task.title}

          <span className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400 ml-2">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-violet-500" />
              {task.createdBy?.name || "Unknown"}
            </span>
          </span>
        </h3>

        <p className="text-xs text-zinc-500 line-clamp-1">
          {task.description || "No description."}
        </p>
      </div>

      <span
        className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
          task.priority === "HIGH"
            ? "bg-rose-100 text-rose-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {task.priority}
      </span>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-zinc-50 gap-2">
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span className="">Due Date:</span>
          {task.dueDate
            ? format(new Date(task.dueDate), "MMM dd, yyyy")
            : "No Date"}
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-violet-400" />
          <span className="">Created:</span>
          {task.createdAt
            ? format(new Date(task.createdAt), "MMM dd, yyyy")
            : "Unknown"}
        </div>

        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span className="">Assigned To:</span>
          {task.assignedTo?.name || "Unassigned"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 px-2 text-[10px] font-bold uppercase"
        >
          <Edit2 className="h-3 w-3 mr-1" /> Edit
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={isDeleting}
          onClick={onDelete}
          className="h-7 px-2 text-[10px] font-bold uppercase text-rose-500"
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);
