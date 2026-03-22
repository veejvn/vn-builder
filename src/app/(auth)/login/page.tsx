"use client";

import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push("/workspace");
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background-dark">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-900/5 rounded-full blur-[80px]"></div>
      </div>

      <main className="w-full max-w-120 px-4 relative z-10">
        <div className="bg-[#111418] border border-[#282f39] rounded-xl shadow-2xl p-8 md:p-10 backdrop-blur-sm bg-opacity-95">
          {/* Header */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="flex items-center gap-3 text-white">
              <div className="size-10 text-primary">
                <svg
                  className="w-full h-full"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fill="white"
                    fillOpacity="0.9"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                VNBuilder
              </h2>
            </div>
            <div className="text-center">
              <h1 className="text-white tracking-tight text-xl font-semibold leading-tight">
                Welcome back
              </h1>
              <p className="text-[#9da8b9] text-sm mt-2">
                Sign in to continue building.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-pulse">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                className="text-white text-sm font-medium leading-normal"
                htmlFor="email"
              >
                Email address
              </label>
              <div className="relative flex w-full flex-1 items-stretch rounded-lg">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b4554] bg-[#1c2027] focus:border-primary h-12 placeholder:text-[#64748b] px-4 text-base font-normal leading-normal transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-white text-sm font-medium leading-normal"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative flex w-full flex-1 items-stretch rounded-lg">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b4554] bg-[#1c2027] focus:border-primary h-12 placeholder:text-[#64748b] px-4 pr-12 text-base font-normal leading-normal transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-[#9da8b9] hover:text-white transition-colors cursor-pointer rounded-r-lg focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 mt-2 shadow-[0_0_15px_rgba(19,109,236,0.3)] hover:shadow-[0_0_20px_rgba(19,109,236,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="truncate">Sign In</span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[#64748b] text-xs">
            © 2024 VNBuilder. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
