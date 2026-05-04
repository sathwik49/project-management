import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  type signInInputType,
} from "../../validations/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { signInMutation } from "../../api/api";
import { CircleLoader } from "react-spinners";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import type { signInResponseType } from "../../api/types";
import { baseURL } from "../../api/baseUrl";
import { AUTH_REDIRECT_URL } from "@/lib/constants";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });
  const password = watch("password");
  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: signInMutation,
  });

  const [searchParams] = useSearchParams();
  const backTo = searchParams.get("back");

  const onSubmit = (data: signInInputType) => {
    mutate(data, {
      onSuccess() {
        //toast("Signed in successfully.Redirecting...");
        const destination = backTo
          ? decodeURIComponent(backTo)
          : AUTH_REDIRECT_URL;
        navigate(destination);
        reset();
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          const data: signInResponseType = error.response?.data;
          toast.error(data.message);
        }
      },
    });
  };
  const handleGoogleSignIn = () => {
    window.location.href = `${baseURL}/auth/google`;
  };
  return (
    <div className="bg-white w-full max-w-md p-8 rounded-lg flex flex-col space-y-2 shadow-xl">
      <Link to={"/"} className="text-center mb-3">
        <h1 className="text-3xl font-bold text-violet-500">ProManSys</h1>
        <p className="text-sm font-medium text-gray-600">
          Mange your Projects in a smart way
        </p>
      </Link>

      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="abc@example.com"
            className="block w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Enter your password"
              className="block w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none"
              {...register("password")}
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-4 top-3.5 size-3"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            )}
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Link
          to={"/forgot-password"}
          className="flex justify-end text-violet-400 hover:underline"
        >
          Forgot Password?
        </Link>
        <button
          className="w-full px-4 py-2 bg-violet-500 rounded-lg mt-2 text-white cursor-pointer transition duration-200 hover:shadow"
          type="submit"
        >
          {isPending ? <CircleLoader size={15} /> : "Sign In"}
        </button>
      </form>

      <button
        className="w-full px-4 py-2 rounded-lg mt-2 cursor-pointer flex justify-center items-center gap-3 border hover:bg-gray-200 hover:text-black"
        onClick={handleGoogleSignIn}
      >
        <FcGoogle size={19} />
        <span className="">Sign In with Google</span>
      </button>
      <p className="text-center text-medium">
        Don't have an account?{" "}
        <Link
          to={
            backTo ? `/sign-up?back=${encodeURIComponent(backTo)}` : "/sign-up"
          }
          className="hover:underline text-violet-600 cursor-pointer"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
