import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Navbar() {
  const { data } = useAuthUser();
  return (
    <header className="bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold text-violet-600 transition-colors hover:text-violet-700"
      >
        ProManSys
      </Link>

      {data?.details ? (
        <Link
          to={"/dashboard"}
          className="bg-violet-600 text-white rounded-md px-4 py-2"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/sign-in">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-violet-700"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button className="bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-200">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
