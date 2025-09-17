"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !repassword) {
      toast.error("All fields are required!");

      return;
    }

    if (password !== repassword) {
      toast.error("Passwords do not match!");

      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.message || "Signup failed");
      }

      toast.success("Account created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setRePassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <div className="bg-white w-[250px] h-[750px] lg:w-[600px] rounded-[20px] shadow-lg flex justify-center items-center">
        <Toaster position="top-center" />
        <form onSubmit={handleSignup}>
          <div>
            <p>Sign Up to Booking System</p>
            <a className="text-purple-500 hover:underline" href="/auth/login">
              Go back to Login
            </a>
          </div>
          <div className="py-2">
            <label htmlFor="username">Username</label>
            <div className="py-1">
              <input
                className="bg-gray-100 p-3 lg:w-[400px] h-[60px] border-purple-300 border-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="py-2">
            <label htmlFor="email">E-mail</label>
            <div className="py-1">
              <input
                className="bg-gray-100 p-3 lg:w-[400px] h-[60px] border-purple-300 border-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="py-2">
            <div className="flex justify-between">
              <label htmlFor="username">Password</label>
              <div className="text-purple-500">Show</div>
            </div>

            <div>
              <input
                className="bg-gray-100 p-3 w-[400px] h-[60px] border-purple-300 border-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="py-2">
            <div className="flex justify-between">
              <label htmlFor="repassword">Re-Password</label>
              <div className="text-purple-500">Show</div>
            </div>

            <div>
              <input
                className="bg-gray-100 p-3 w-[400px] h-[60px] border-purple-300 border-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                type="text"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </div>
          </div>
          {/* <Input label="Username" className="w-[300px] mt-2"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  /> */}
          {/* <Input label="Password" className="w-[300px] mt-2"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  /> */}
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
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
          </div>
          {/* <div className="flex justify-center pt-4">
                    <button
                    className="p-3 w-[280px] rounded-lg bg-purple-500 text-white"> 
                          Sign Up
                    </button>
                  </div> */}
        </form>
      </div>
    </div>
  );
}
