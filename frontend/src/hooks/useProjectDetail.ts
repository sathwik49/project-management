import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectAnalytics,
  getProjectById,
  createTask,
  updateTask,
  getWorkspaceMembers,
} from "@/api/api";
import { QUERY_KEYS } from "@/lib/endpoints";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { TaskWithDetails } from "@/api/types";

export const useProjectDetail = () => {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(
    null,
  );

  const getErrorMessage = (error: unknown) => {
    if (error instanceof AxiosError)
      return error.response?.data?.message || "Server error";
    return "An unexpected error occurred";
  };

  const membersQuery = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId!),
    enabled: !!workspaceId,
  });

  const projectQuery = useQuery({
    queryKey: QUERY_KEYS.PROJECT.DETAIL(workspaceId!, projectId!),
    queryFn: () => getProjectById(workspaceId!, projectId!),
    enabled: !!projectId,
  });

  const analyticsQuery = useQuery({
    queryKey: QUERY_KEYS.PROJECT.ANALYTICS(workspaceId!, projectId!),
    queryFn: () => getProjectAnalytics(workspaceId!, projectId!),
    enabled: !!projectId,
  });

  const taskMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        ...data,
        assignedTo:
          !data.assignedTo || data.assignedTo === "none"
            ? undefined
            : data.assignedTo,
      };
      if (selectedTask?.id) {
        return updateTask(workspaceId!, projectId!, selectedTask.id, payload);
      }

      return createTask(workspaceId!, projectId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, projectId],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.ANALYTICS(workspaceId!, projectId!),
      });

      setIsModalOpen(false);
      toast.success(selectedTask ? "Task updated" : "Task created");

      setSelectedTask(null);
    },

    onError: (e) => {
      toast.error(getErrorMessage(e));
    },
  });

  return {
    workspaceId,
    projectId,
    navigate,
    isModalOpen,
    setIsModalOpen,
    selectedTask,
    setSelectedTask,
    projectQuery,
    analyticsQuery,
    membersQuery,
    taskMutation,
    getErrorMessage,
  };
};
