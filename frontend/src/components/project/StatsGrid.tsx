import {
  ListTodo,
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
}: StatCardProps) => (
  <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
    <div
      className={`h-10 w-10 rounded-xl ${bgClass} flex items-center justify-center`}
    >
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold text-zinc-900">{value ?? 0}</p>
    </div>
  </div>
);

export const StatsGrid = ({ analytics }: { analytics: any }) => {
  const stats = [
    {
      label: "Total Tasks",
      val: analytics?.totalTasks,
      icon: ListTodo,
      col: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Overdue",
      val: analytics?.overdueTasks,
      icon: AlertTriangle,
      col: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Completed",
      val: analytics?.completedTasks,
      icon: CheckCircle2,
      col: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((s) => (
        <StatCard
          key={s.label}
          label={s.label}
          value={s.val}
          icon={s.icon}
          colorClass={s.col}
          bgClass={s.bg}
        />
      ))}
    </div>
  );
};
