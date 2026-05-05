import { Calendar } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { TaskWithDetails } from "@/api/types";

export const TaskList = ({
  tasks,
  search,
  isLoading,
  onEdit,
  onDelete,
  deletingTaskId,
}: {
  tasks: TaskWithDetails[];
  search: string;
  isLoading: boolean;
  onEdit: (task: TaskWithDetails) => void;
  onDelete: (taskId: string) => void;
  deletingTaskId: string | null;
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white border border-zinc-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="border border-dashed border-zinc-200 rounded-2xl py-16 text-center bg-white">
            <div className="h-12 w-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-zinc-300" />
            </div>
            <p className="text-sm font-medium text-zinc-500">
              {search
                ? "No tasks match your search"
                : "No tasks found in this project"}
            </p>
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.id)}
                isDeleting={deletingTaskId === task.id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
