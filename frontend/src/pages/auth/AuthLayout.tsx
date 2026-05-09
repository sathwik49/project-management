import { useAuthUser } from "@/hooks/useAuthUser";
import { AUTH_REDIRECT_URL } from "@/lib/constants";
import { ArrowLeftCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const navigate = useNavigate();
  const { data, isLoading } = useAuthUser();
  const user = data?.details;

  useEffect(() => {
    if (!isLoading && user) {
      navigate(AUTH_REDIRECT_URL, { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50/60">
        <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-violet-50/60 px-4 sm:px-6 lg:px-8">
      <Link
        to={"/"}
        className="absolute z-50 top-7 left-7 flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeftCircle size={30} />
        <span className="font-medium">Back to home</span>
      </Link>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
