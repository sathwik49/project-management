import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectInsightSidebar } from "@/components/project/ProjectInsightSidebar";
import { StatsGrid } from "@/components/project/StatsGrid";
import { TaskFormModal } from "@/components/task/TaskFormModal";
import { TaskList } from "@/components/task/TaskList";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { getTasksInWorkspace } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/components/Pagination";
import { deleteTask } from "@/api/api";
import toast from "react-hot-toast";
import {
  TaskFilters,
  type TaskFiltersType,
} from "@/components/task/TaskFilters";

export default function ProjectDetail() {
  const {
    workspaceId,
    projectId,
    navigate,
    isModalOpen,
    setIsModalOpen,
    selectedTask,
    setSelectedTask,
    projectQuery,
    analyticsQuery,
    taskMutation,
    getErrorMessage,
    membersQuery,
  } = useProjectDetail();

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const [filters, setFilters] = useState<TaskFiltersType>({
    status: [],
    priority: [],
  });

  const handleClearFilters = () => {
    setFilters({ status: [], priority: [] });
    setPage(1);
  };

  const handleFiltersChange = (f: TaskFiltersType) => {
    setFilters(f);
    setPage(1);
  };

  const tasksQuery = useQuery({
    queryKey: ["tasks", workspaceId, projectId, page, debouncedSearch, filters],
    queryFn: () =>
      getTasksInWorkspace(workspaceId!, {
        projectId,
        pageNumber: page,
        pageSize: 5,
        search: debouncedSearch,
        status: filters.status,
        priority: filters.priority,
      }),
    enabled: !!projectId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      setDeletingTaskId(taskId);
      return deleteTask(workspaceId!, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-analytics", workspaceId, projectId],
      });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Failed to delete task"),
    onSettled: () => setDeletingTaskId(null),
  });

  const handleDelete = (taskId: string) => {
    if (deletingTaskId) return;
    if (window.confirm("Delete?")) {
      deleteMutation.mutate(taskId);
    }
  };

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const totalPages = tasksQuery.data?.details?.pagination?.totalPages || 1;
    if (page > totalPages) setPage(totalPages);
  }, [tasksQuery.data, page]);

  if (projectQuery.isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
      </div>
    );

  if (projectQuery.error)
    return (
      <ErrorState
        message={getErrorMessage(projectQuery.error)}
        onBack={() => navigate(-1)}
      />
    );

  const project = projectQuery.data?.details;
  const members = membersQuery.data?.details || [];
  const tasks = tasksQuery.data?.details?.tasks || [];

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <ProjectHeader
          name={project?.name}
          description={project?.description}
          onBack={() => navigate(`/workspaces/${workspaceId}/projects`)}
          onSettings={() =>
            navigate(
              `/workspaces/${workspaceId}/projects/${projectId}/settings`,
            )
          }
          onNewTask={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
        />

        <StatsGrid analytics={analyticsQuery.data?.details} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-2">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-500" />
                Active Tasks
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={handleSearchChange}
                    className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 focus:bg-white outline-none w-40 sm:w-56"
                  />
                </div>
                <TaskFilters
                  filters={filters}
                  onChange={handleFiltersChange}
                  onClear={handleClearFilters}
                />
              </div>
            </div>

            <TaskList
              tasks={tasks}
              isLoading={tasksQuery.isLoading}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingTaskId={deletingTaskId}
            />
            <Pagination
              page={page}
              total={tasksQuery.data?.details?.pagination?.totalPages || 0}
              onPageChange={setPage}
              isLoading={tasksQuery.isLoading}
            />
          </div>

          <div className="lg:col-span-1">
            <ProjectInsightSidebar
              project={project}
              analytics={analyticsQuery.data?.details}
            />
          </div>
        </div>
      </main>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        initialData={selectedTask}
        onSubmit={(data: any) => taskMutation.mutate(data)}
        isLoading={taskMutation.isPending}
        members={members}
      />
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onBack: () => void;
}

export const ErrorState = ({ message, onBack }: ErrorStateProps) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zinc-50/50">
    <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
      <AlertTriangle className="h-8 w-8 text-rose-500" />
    </div>

    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
      Something went wrong
    </h2>

    <p className="text-sm text-zinc-500 max-w-xs mt-2 leading-relaxed">
      {message ||
        "We couldn't load the project data. Please check your connection or try again."}
    </p>

    <div className="flex flex-col sm:flex-row gap-3 mt-8">
      <Button
        onClick={onBack}
        variant="outline"
        className="h-10 border-zinc-200 font-bold text-xs uppercase tracking-widest px-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
      </Button>

      <Button
        onClick={() => window.location.reload()}
        className="h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest px-6"
      >
        Retry Connection
      </Button>
    </div>
  </div>
);
