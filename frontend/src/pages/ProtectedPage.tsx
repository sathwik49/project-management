import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import AppHeader from "@/components/AppHeader";
import { Loader2 } from "lucide-react";

export default function ProtectedPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useAuthUser();
  const user = data?.details;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50/70">
        <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-violet-50/70">
      <AppHeader user={user} />
      <Outlet />
    </div>
  );
}
