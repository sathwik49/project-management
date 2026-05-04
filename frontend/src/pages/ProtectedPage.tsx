import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import AppHeader from "@/components/AppHeader";

export default function ProtectedPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useAuthUser();
  const user = data?.details;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-violet-50/70">
      <AppHeader user={user} />
      <Outlet />
    </div>
  );
}
