import { Clock, User, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TaskItemProps {
  task: any;
  onEdit: (task: any) => void;
}

export const TaskItem = ({ task, onEdit }: TaskItemProps) => {
  const statusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600",
    IN_PROGRESS: "bg-violet-100 text-violet-700",
    DONE: "bg-emerald-100 text-emerald-700",
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-50 text-blue-600",
    MEDIUM: "bg-amber-50 text-amber-600",
    HIGH: "bg-rose-50 text-rose-600",
  };

  return (
    <div
      onClick={() => onEdit(task)}
      className="bg-white border border-zinc-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between hover:border-violet-200 transition-colors shadow-sm cursor-pointer group gap-2"
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-2 w-2 rounded-full ${task.status === "DONE" ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        <div>
          <p className="text-sm font-bold text-zinc-700 leading-tight">
            {task.title}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
              <Clock className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </div>
            {task.assignedTo && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                <User className="h-3 w-3" />
                Assigned
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className={`text-[9px] font-bold uppercase py-0 px-2 h-5 border-none ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </Badge>
        <Badge
          className={`text-[9px] font-bold uppercase py-0 px-2 h-5 border-none hidden sm:inline-flex ${statusColors[task.status]}`}
        >
          {task.status.replace("_", " ")}
        </Badge>
        <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4 text-zinc-400" />
        </button>
      </div>
    </div>
  );
};
