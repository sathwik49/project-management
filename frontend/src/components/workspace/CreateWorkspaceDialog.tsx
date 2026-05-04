import { createWorkspace } from "@/api/api";
import { QUERY_KEYS } from "@/lib/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CreateWorkspaceDialogProps {
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function CreateWorkspaceDialog({
  triggerLabel,
  triggerClassName,
}: CreateWorkspaceDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKSPACE.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
      setIsOpen(false);
      toast.success("Workspace created!");
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    if (!name.trim()) return;
    mutation.mutate({ name, description: description || undefined });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerLabel ? (
          <Button
            size="sm"
            variant="outline"
            className={triggerClassName ?? "text-xs h-7"}
          >
            {triggerLabel}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-violet-600 hover:bg-violet-50"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={handleCreate}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Name</label>
            <input
              name="name"
              required
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="Marketing, Engineering, etc."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">
              Description
            </label>
            <input
              name="description"
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="Optional"
            />
          </div>
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create Workspace"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
