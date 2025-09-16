"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/profile");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {}
  };

  return (
    <div className="flex">
      <div className="bg-white w-[250px] h-[750px] lg:w-[600px] rounded-[20px] shadow-lg flex justify-center items-center">
        <form onSubmit={handleLogin}>
          <div className="text-purple-500 py-4 text-[30px] ">
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
                className="bg-gray-100 p-3 lg:w-[400px] h-[60px] border-purple-300 border-1"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="py-2">
            <div className="flex justify-between">
              <label htmlFor="username">Username</label>
              <div className="text-purple-500">Show</div>
            </div>

            <div>
              <input
                className="bg-gray-100 p-3 w-[400px] h-[60px] border-purple-300 border-1"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="py-2">
            <label className="relative flex items-center cursor-pointer">
              <input className="sr-only peer" type="checkbox" />
              <div
                className="w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center
                                peer-checked:bg-purple-500 peer-checked:border-purple-500"
              >
                <svg
                  className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="ml-2 select-none">Keep me logged in</span>
            </label>
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
              className="p-3 w-[100px] rounded-lg bg-purple-500 text-white"
              type="submit"
            >
              Log In
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
