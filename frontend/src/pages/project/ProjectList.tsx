import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectsInWorkspace } from "@/api/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  FolderKanban,
  ChevronRight,
  Search,
  Layout,
} from "lucide-react";
import { QUERY_KEYS } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProjectList() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.PROJECT.ALL(workspaceId!), debouncedSearch, page],
    queryFn: () =>
      getProjectsInWorkspace(workspaceId as string, {
        pageNumber: page,
        pageSize: 8,
        search: debouncedSearch,
      }),
    enabled: Boolean(workspaceId),
  });

  const projects = data?.details || [];
  const totalPages = data?.pagination?.totalPages || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-zinc-100 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 flex flex-wrap items-center justify-between gap-2 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/workspaces/${workspaceId}`)}
              className="p-2 hover:bg-zinc-50 rounded-full transition-colors group cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-zinc-400 group-hover:text-violet-600" />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-violet-50 p-2 rounded-lg">
                <FolderKanban className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900">Projects</h1>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-1">
                  Workspace Projects
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-violet-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 focus:bg-white outline-none w-40 sm:w-64 transition-all"
              />
            </div>

            <Button
              size="sm"
              onClick={() => navigate(`/workspaces/${workspaceId}`)}
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9 px-4 rounded-md shadow-sm gap-1.5 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-white border border-zinc-100 animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-zinc-200 rounded-2xl py-24 text-center bg-white">
            <Layout className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-zinc-900">
              No projects found
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {search
                ? "Try a different search term."
                : "Create your first project to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project: any) => (
                <Card
                  key={project.id}
                  onClick={() =>
                    navigate(
                      `/workspaces/${workspaceId}/projects/${project.id}`,
                    )
                  }
                  className="group cursor-pointer border-zinc-200 hover:border-violet-400 transition-all hover:shadow-lg hover:shadow-violet-500/5 flex flex-col"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-md bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-sm group-hover:bg-violet-600 group-hover:text-white transition-all">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500" />
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 py-0 flex-1">
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-violet-700 truncate">
                      {project.name}
                    </h3>
                    <p className="text-[12px] text-zinc-500 line-clamp-2 mt-1.5">
                      {project.description ||
                        "No description provided for this project."}
                    </p>
                  </CardContent>

                  <CardFooter className="px-5 py-4 bg-zinc-50 mt-auto border-t flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">
                        Active
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-all">
                      Open Project
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                page={page}
                total={totalPages}
                onPageChange={setPage}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
