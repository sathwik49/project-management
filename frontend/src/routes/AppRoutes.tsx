import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import AuthBase from "../pages/auth/AuthLayout";
import VerifyEmail from "../pages/auth/VerifyEmail";
import NotFound from "../pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import ProtectedPage from "@/pages/ProtectedPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route element={<AuthBase />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />
      </Route>
      <Route element={<ProtectedPage />}>
        <Route index path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
