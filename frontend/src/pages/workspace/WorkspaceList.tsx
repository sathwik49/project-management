import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllUserWorkspaces, createWorkspace } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  ChevronRight,
  Loader2,
  Search,
  Layers,
  Layout,
} from "lucide-react";
import { QUERY_KEYS } from "@/lib/endpoints";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function WorkspaceList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.WORKSPACE.ALL, debouncedSearch, page],
    queryFn: () => getAllUserWorkspaces(debouncedSearch, page),
  });

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKSPACE.ALL,
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
      setIsOpen(false);
      toast.success("Workspace created!");
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  const workspaces = data?.details?.workspaces ?? [];
  const totalPages = data?.details?.totalPages ?? 1;

  useEffect(() => {
    if (!data) return;

    const total = data.details?.totalPages || 1;

    if (page > total) {
      setPage(total);
    }
  }, [data, page]);

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    if (mutation.isPending) return;
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name.trim()) return;

    mutation.mutate(
      { name, description: description || undefined },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-zinc-100 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-violet-50 p-2 rounded-lg">
              <Layers className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-900 tracking-tight leading-none">
                Workspaces
              </h1>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-1">
                Platform Overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 focus:bg-white outline-none w-64 transition-all"
              />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9 px-4 rounded-md shadow-sm gap-1.5 font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New WorkSpace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 pt-4" onSubmit={handleCreate}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-zinc-500 ml-1">
                      Workspace Name
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full rounded-md border border-zinc-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                      placeholder="e.g. Marketing Team"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-zinc-500 ml-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full rounded-md border border-zinc-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none resize-none transition-all"
                      placeholder="What is this space for?"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-700 h-11 font-bold flex items-center justify-center"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create Workspace"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-white border border-zinc-100 animate-pulse"
              />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="border border-dashed border-zinc-200 rounded-2xl py-24 text-center bg-white">
            <Layout className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-zinc-900">
              No workspaces found
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Try a different search or create a new space.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                  className="group cursor-pointer border-zinc-200 hover:border-violet-400 transition-all hover:shadow-lg hover:shadow-violet-500/5 overflow-hidden flex flex-col"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-md bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-sm group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                        {workspace.name.charAt(0).toUpperCase()}
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 transition-all" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 py-0 flex-1">
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-violet-700 transition-colors truncate">
                      {workspace.name}
                    </h3>
                    <p className="text-[12px] text-zinc-500 line-clamp-2 leading-snug mt-1.5 font-medium">
                      {workspace.description ||
                        "No description provided for this space."}
                    </p>
                  </CardContent>
                  <CardFooter className="px-5 py-4 bg-zinc-50/50 mt-auto border-t border-zinc-100/50 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      Open Workspace
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
