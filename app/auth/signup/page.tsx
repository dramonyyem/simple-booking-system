"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!repassword) newErrors.repassword = "Re-enter password is required";
    if (password && repassword && password !== repassword) {
      newErrors.repassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success(data.message);
      router.push("/auth/login");

      setUsername("");
      setEmail("");
      setPassword("");
      setRePassword("");
      setErrors({});
    } catch (err: any) {
      toast.error(err.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg mx-auto lg:max-w-2xl rounded-2xl shadow-lg p-6 sm:p-10">
        <Toaster position="top-center" />
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <p className="text-xl font-semibold">Sign Up to Booking System</p>
            <a
              className="text-purple-500 hover:underline text-sm"
              href="/auth/login"
            >
              Go back to Login
            </a>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username">Username</label>
            <input
              className={`mt-1 bg-gray-100 p-3 w-full rounded-lg border ${
                errors.username ? "border-red-500" : "border-purple-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              className={`mt-1 bg-gray-100 p-3 w-full rounded-lg border ${
                errors.email ? "border-red-500" : "border-purple-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="text-purple-500 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              className={`mt-1 bg-gray-100 p-3 w-full rounded-lg border ${
                errors.password ? "border-red-500" : "border-purple-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Re-Password */}
          <div>
            <div className="flex justify-between">
              <label htmlFor="repassword">Re-Password</label>
              <button
                type="button"
                className="text-purple-500 text-sm"
                onClick={() => setShowRePassword(!showRePassword)}
              >
                {showRePassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              className={`mt-1 bg-gray-100 p-3 w-full rounded-lg border ${
                errors.repassword ? "border-red-500" : "border-purple-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              type={showRePassword ? "text" : "password"}
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
            {errors.repassword && (
              <p className="text-red-500 text-sm mt-1">{errors.repassword}</p>
            )}
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
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
