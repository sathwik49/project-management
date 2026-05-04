import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validations/task.validation";

export const TaskFormModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading,
  members,
}: any) => {
  const mode = initialData ? "edit" : "create";
  const schema = mode === "edit" ? updateTaskSchema : createTaskSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "TODO",
      priority: "MEDIUM",
      assignedTo: "none",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      reset({
        ...initialData,
        dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
        assignedTo: initialData?.assignedTo?.id ?? "none",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
        assignedTo: "none",
      });
    }
  }, [isOpen, initialData, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-zinc-900">
            {mode === "edit" ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-400">
              Title
            </label>
            <Input
              {...register("title")}
              placeholder="Task name..."
              className="h-9 text-sm"
            />
            {errors.title && (
              <p className="text-[10px] text-rose-500 font-bold uppercase">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-400">
              Description
            </label>
            <Textarea
              {...register("description")}
              placeholder="Add details..."
              className="text-sm resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400">
                Status
              </label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODO">TODO</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="IN_REVIEW">In Review</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                      <SelectItem value="BACKLOG">Backlog</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400">
                Priority
              </label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-400">
              Assign To
            </label>
            <Controller
              control={control}
              name="assignedTo"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? "none"}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue>
                      {field.value === "none"
                        ? "Unassigned"
                        : members.find((m: any) => m.user.id === field.value)
                            ?.user.name ||
                          members.find((m: any) => m.user.id === field.value)
                            ?.user.email ||
                          "Select a member"}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>

                    {members.map((member: any) => (
                      <SelectItem key={member.user.id} value={member.user.id}>
                        {member.user.name || member.user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-400">
              Due Date
            </label>
            <Input
              type="date"
              {...register("dueDate")}
              className="h-9 text-sm"
            />
            {errors.dueDate && (
              <p className="text-[10px] text-rose-500 font-bold uppercase">
                {errors.dueDate.message as string}
              </p>
            )}
          </div>

          <Button
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 font-bold text-xs h-9 mt-2"
          >
            {isLoading
              ? "Saving..."
              : mode === "edit"
                ? "Update Task"
                : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
