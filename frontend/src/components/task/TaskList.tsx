import { BarChart3, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import type { TaskWithDetails } from "@/api/types";

export const TaskList = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  onCreateFirst,
}: any) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-white border border-zinc-100 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="border border-dashed border-zinc-200 rounded-2xl py-16 text-center bg-white">
        <div className="h-12 w-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-6 w-6 text-zinc-300" />
        </div>
        <p className="text-sm font-medium text-zinc-500">
          No tasks found in this project
        </p>
        <Button
          variant="link"
          className="text-violet-600 font-bold text-xs uppercase mt-1"
          onClick={onCreateFirst}
        >
          Create your first task
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-violet-500" /> Active Tasks
        </h2>
      </div>
      {tasks.map((task: TaskWithDetails) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};
