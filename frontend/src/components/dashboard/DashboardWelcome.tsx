import { CalendarDays } from "lucide-react";

interface DashboardWelcomeProps {
  userName?: string;
  workspaceName?: string;
}

export default function DashboardWelcome({
  userName,
  workspaceName,
}: DashboardWelcomeProps) {
  return (
    <div className="flex items-end justify-between pb-1 border-b border-zinc-200/60">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Welcome back,{" "}
          <span className="text-violet-600">
            {userName?.split(" ")[0] || "User"}
          </span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {workspaceName ? (
            <>
              You have tasks to review in{" "}
              <span className="font-semibold text-zinc-700">
                {workspaceName}
              </span>
            </>
          ) : (
            <span className="text-amber-600 font-medium text-xs">
              Action Required: Select a workspace to begin
            </span>
          )}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 shadow-sm">
        <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
        {new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
