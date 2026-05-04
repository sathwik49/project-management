import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center py-20 px-6 overflow-hidden">
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-violet-100 opacity-50 blur-[80px]"></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Simple Project <span className="text-violet-600">Management</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Workspaces. Projects. Tasks. Teams. Everything you need to get work
          done —{" "}
          <span className="font-medium text-gray-900">nothing more.</span>
        </p>

        <div className="pt-4">
          <Link to="/sign-up">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 gap-2 h-12 px-8 text-md shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
