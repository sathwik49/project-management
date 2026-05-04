import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export const ProjectInsightSidebar = ({ project, analytics }: any) => {
  const completionPercentage = Math.round(
    (analytics?.completedTasks / analytics?.totalTasks) * 100 || 0,
  );

  return (
    <div className="space-y-4">
      <Card className="border-zinc-200 shadow-sm border-t-4 border-t-violet-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Project Insight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-[9px] font-bold uppercase text-zinc-400">
              Created On
            </p>
            <p className="text-xs font-semibold text-zinc-700 mt-1">
              {project?.createdAt
                ? format(new Date(project.createdAt), "MMMM dd, yyyy")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase text-zinc-400">
              Task Completion
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-zinc-600">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
