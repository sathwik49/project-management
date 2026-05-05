import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

export const Pagination = ({
  page,
  total,
  onPageChange,
  isLoading,
}: {
  page: number;
  total: number;
  onPageChange: (fn: (p: number) => number) => void;
  isLoading?: boolean;
}) => {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1 pt-2">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        Page {page} / {total}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1 || isLoading}
          onClick={() => {
            onPageChange((p) => p - 1);
            window.scrollTo(0, 0);
          }}
          className="h-7 w-7 p-0 border-zinc-200"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>

        <Button
          variant="outline"
          disabled={page >= total || isLoading}
          onClick={() => {
            onPageChange((p) => p + 1);
            window.scrollTo(0, 0);
          }}
          className="h-7 w-7 p-0 border-zinc-200"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
