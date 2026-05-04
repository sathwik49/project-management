import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-lg font-bold text-zinc-800 mb-2">Page not found</h2>
      <p className="text-sm text-zinc-500 max-w-75 mb-8 leading-relaxed">
        The page you are looking for doesn't exist or has been moved away.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="h-10 px-6 border-zinc-200 text-zinc-600 font-bold text-[11px] uppercase tracking-widest hover:bg-zinc-50"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-2" />
          Go Back
        </Button>

        <Button
          onClick={() => navigate("/")}
          className="h-10 px-6 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[11px] uppercase tracking-widest shadow-md shadow-violet-100"
        >
          <Home className="h-3.5 w-3.5 mr-1" />
          Home
        </Button>
      </div>

      <p className="mt-5 text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
        <span>&copy;</span>
        {new Date().getFullYear()} ProManSys
      </p>
    </div>
  );
}
