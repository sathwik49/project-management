import {  useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CircleLoader } from "react-spinners";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [isVerifying, setIsVerifying] = useState(true);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setIsVerifying(false);
      toast.error("Invalid or missing verification link", { duration: 5000 });
      return;
    }
  }, [token]);

  if (isVerifying) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center space-y-6 border border-violet-100">
        <div className="flex flex-col items-center gap-4">
          <CircleLoader size={40} />
          <h2 className="text-xl font-semibold text-violet-800">
            Verifying your email...
          </h2>
          <p className="text-gray-600">
            Just a moment — we're checking the link.
          </p>
        </div>
        <button
          onClick={() => {
            (setStatus("success"), setIsVerifying(false));
          }}
        >
          OK
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 text-center space-y-6 border border-violet-100">
        <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-violet-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-violet-800">Email verified!</h1>
        <p className="text-gray-600">
          Your email has been successfully confirmed.
          <br />
          You can now sign in to your account.
        </p>

        <button
          onClick={() => navigate("/", { replace: true })}
          className="inline-block px-8 py-3 bg-violet-600 text-white font-medium rounded-lg cursor-pointer transition-colors shadow-sm"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 text-center space-y-6 border border-violet-100">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-red-800">Verification failed</h1>
      <p className="text-gray-600">
        This link is invalid, expired, or has already been used.
      </p>

      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Didn't receive the email or need a new link?
        </p>
        <button
          type="button"
          onClick={() => {
            toast("Resend requested — check your inbox shortly");
            // Add real resend logic here later
          }}
          className="text-violet-700 hover:text-violet-800 font-medium underline"
        >
          Resend verification email
        </button>
      </div>

      <button
        onClick={() => navigate("/", { replace: true })}
        className="inline-block px-8 py-3 bg-violet-600 text-white font-medium rounded-lg cursor-pointer transition-colors shadow-sm"
      >
        Back to Sign In
      </button>
    </div>
  );
}
