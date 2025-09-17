"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 loading state
  const [showPassword, setShowPassword] = useState(false); // 🔹 toggle password
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please fill in username and password");

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
        window.location.href = "/profile";
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Toaster position="top-center" />
      <div className="bg-white w-[250px] h-[750px] lg:w-[600px] rounded-[20px] shadow-lg flex justify-center items-center">
        <form onSubmit={handleLogin}>
          <div className="text-purple-500 py-4 text-[30px]">
            Simple Booking System
          </div>
          <div>
            <p>Don&apos;t forget to book!</p>
            <a className="text-purple-500 hover:underline" href="/auth/signup">
              Create Account
            </a>
          </div>

          <div className="py-2">
            <label htmlFor="username">Username</label>
            <div className="py-1">
              <input
                className="bg-gray-100 p-3 lg:w-[400px] h-[60px] border-purple-300 border-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                disabled={isSubmitting}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="py-2">
            <div className="flex justify-between">
              <label htmlFor="password">Password</label>
              <button
                className="text-purple-500 font-medium"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div>
              <input
                className="bg-gray-100 p-3 w-[400px] h-[60px] border-purple-300 border-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                disabled={isSubmitting}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="py-4">
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
              {isSubmitting ? "" : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
