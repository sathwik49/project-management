import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-violet-50/60 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
