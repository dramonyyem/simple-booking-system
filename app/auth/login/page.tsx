"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please fill in Username and Password");

      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error connecting to server");
      } else if (data.status === 404) {
        toast.error(data.message);
      } else if (data.status === 200) {
        toast.success(data.message);
        window.location.href = "/bookings";
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full mx-auto max-w-md sm:max-w-lg lg:max-w-xl rounded-2xl shadow-lg p-6 sm:p-10">
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-purple-600 text-2xl font-bold">
              Simple Booking System
            </h1>
            <p className="text-gray-600">Don&apos;t forget to book!</p>
            <a
              className="text-purple-500 hover:underline text-sm"
              href="/auth/signup"
            >
              Create Account
            </a>
          </div>

          {/* Username */}
          <div>
            <label className="block font-medium" htmlFor="username">
              Username
            </label>
            <input
              className="mt-1 bg-gray-100 p-3 w-full rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
              disabled={isSubmitting}
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center">
              <label className="font-medium" htmlFor="password">
                Password
              </label>
              <button
                className="text-purple-500 text-sm font-medium"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              className="mt-1 bg-gray-100 p-3 w-full rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
              disabled={isSubmitting}
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit button */}
          <div>
            <button
              className={`w-full py-3 mt-4 rounded-lg text-white font-semibold shadow-lg flex justify-center items-center gap-2
                bg-gradient-to-r from-purple-500 to-pink-500 
                hover:scale-105 hover:shadow-2xl transition-transform duration-200`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
