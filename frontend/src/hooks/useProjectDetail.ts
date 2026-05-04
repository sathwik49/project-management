import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectAnalytics,
  getProjectById,
  getTasksInWorkspace,
  createTask,
  updateTask,
  deleteTask,
  getWorkspaceMembers,
} from "@/api/api";
import { QUERY_KEYS } from "@/lib/endpoints";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useProjectDetail = () => {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [page, setPage] = useState(1);

  const tasksQuery = useQuery({
    queryKey: ["tasks", workspaceId, projectId, page],
    queryFn: () =>
      getTasksInWorkspace(workspaceId!, {
        projectId,
        pageNumber: page,
        pageSize: 3,
      }),
    enabled: !!projectId,
  });

  useEffect(() => {
    const totalPages = tasksQuery.data?.details?.pagination?.totalPages || 1;

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [tasksQuery.data, page]);

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

      if (selectedTask && selectedTask.id) {
        return updateTask(workspaceId!, projectId!, selectedTask.id, payload);
      }

      return createTask(workspaceId!, projectId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.ANALYTICS(workspaceId!, projectId!),
      });

      setPage(1);
      setIsModalOpen(false);
      toast.success(selectedTask ? "Task updated" : "Task created");

      setSelectedTask(null);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(workspaceId!, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.ANALYTICS(workspaceId!, projectId!),
      });
      toast.success("Task deleted");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return {
    workspaceId,
    projectId,
    navigate,
    page,
    setPage,
    isModalOpen,
    setIsModalOpen,
    selectedTask,
    setSelectedTask,
    projectQuery,
    analyticsQuery,
    tasksQuery,
    taskMutation,
    deleteMutation,
    membersQuery,
    getErrorMessage,
  };
};
