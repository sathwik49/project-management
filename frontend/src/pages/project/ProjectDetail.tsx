import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectInsightSidebar } from "@/components/project/ProjectInsightSidebar";
import { ProjectPagination } from "@/components/project/ProjectPagination";
import { StatsGrid } from "@/components/project/StatsGrid";
import { TaskFormModal } from "@/components/task/TaskFormModal";
import { TaskList } from "@/components/task/TaskList";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const {
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
    getErrorMessage,
    membersQuery,
  } = useProjectDetail();

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
  const tasks = tasksQuery.data?.details?.tasks || [];
  const members = membersQuery.data?.details || [];

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
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
            <TaskList
              tasks={tasks}
              isLoading={tasksQuery.isLoading}
              onEdit={(task: any) => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
              onDelete={(id: string) =>
                window.confirm("Delete?") && deleteMutation.mutate(id)
              }
              isDeleting={deleteMutation.isPending}
            />
            <ProjectPagination
              page={page}
              total={tasksQuery.data?.details?.pagination?.totalPages}
              onPageChange={setPage}
            />
          </div>

          <ProjectInsightSidebar
            project={project}
            analytics={analyticsQuery.data?.details}
          />
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
