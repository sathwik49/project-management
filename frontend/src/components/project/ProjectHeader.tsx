import { Settings, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProjectHeader = ({
  name,
  description,
  onBack,
  onSettings,
  onNewTask,
}: any) => (
  <div className="space-y-6">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-violet-600 transition-colors cursor-pointer"
    >
      <ArrowLeft className="h-3 w-3" /> Back to Projects
    </button>
    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-violet-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-violet-200 uppercase">
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            {name}
          </h1>
          <p className="text-sm text-zinc-500">
            {description || "No description provided."}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onSettings}
          className="h-9 border-zinc-200 text-zinc-600 font-bold text-xs px-4"
        >
          <Settings className="h-4 w-4 mr-2" /> Project Settings
        </Button>
        <Button
          onClick={onNewTask}
          className="h-9 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 shadow-md shadow-violet-100"
        >
          <Plus className="h-4 w-4 mr-1.5" /> New Task
        </Button>
      </div>
    </div>
  </div>
);
