import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProjectPagination = ({ page, total, onPageChange }: any) => {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
        Page {page} / {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => {
            onPageChange((p: number) => p - 1);
            window.scrollTo(0, 0);
          }}
          className="h-8 w-8 p-0 border-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          disabled={page >= total}
          onClick={() => {
            onPageChange((p: number) => p + 1);
            window.scrollTo(0, 0);
          }}
          className="h-8 w-8 p-0 border-zinc-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
