"use client";

import { useEffect, useState } from "react";

export default function Menu() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const userInformation = async () => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      const name = data?.user?.username || null;

      if (name) {
        setUsername(name);
        localStorage.setItem("username", name);
        setUsername(null);
        localStorage.removeItem("username");
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setUsername(null);
      localStorage.removeItem("username");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("username");

    if (saved) {
      setUsername(saved);
      setLoading(false); // instantly show username without fetching
    } else {
      userInformation();
    }
  }, []);

  return (
    <div className="py-6 bg-white w-full shadow-lg flex justify-between items-center px-4">
      <div className="text-purple-500 flex">
        <a className="mx-4" href="/check_available">
          SIMPLE - BOOKING - SYSTEM
        </a>
      </div>
      <div className="flex items-center">
        <div className="border h-[30px] border-gray-300" />
        {loading ? (
          <div className="px-2 text-gray-500">Loading...</div>
        ) : username ? (
          <a
            className="px-2 flex justify-center items-center text-gray-500"
            href="/profile"
          >
            <div className="px-2">
              <svg
                className="bi bi-person-fill"
                fill="currentColor"
                height="20"
                viewBox="0 0 16 16"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </div>
            <div>{username}</div>
          </a>
        ) : (
          <a
            className="px-2 flex justify-center items-center text-gray-500"
            href="/auth/login"
          >
            Login ?
          </a>
        )}
      </div>
    </div>
  );
}
