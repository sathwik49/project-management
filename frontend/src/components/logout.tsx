import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logOutMutation } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logOutMutation,
    onSuccess: () => {
      queryClient.clear();
      navigate("/", { replace: true });
    },
    onError: (err) => {
      let errmsg = err.message ?? "Internal server error";
      toast.error(errmsg);
    },
  });
  const handleLogout = () => {
    mutate();
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-700 hover:text-violet-700 flex items-center cursor-pointer"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
