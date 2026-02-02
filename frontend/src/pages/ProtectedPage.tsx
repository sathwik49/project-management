import { useAuthUser } from "@/hooks/useAuthUser";
import { Outlet, useNavigate } from "react-router-dom";

export default function ProtectedPage() {
  const navigate = useNavigate();
  const user = useAuthUser();
  if (!user) {
    navigate("/", { replace: true });
  }
  return <Outlet />;
}
