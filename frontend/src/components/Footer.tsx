import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} ProManSys. All rights reserved.
        </p>
        <Link
          to="https://github.com/sathwik49/project-management"
          target="_blank"
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-black"
          >
            <FaGithub className="h-5 w-5" />
            GitHub
          </Button>
        </Link>
      </div>
    </footer>
  );
}
