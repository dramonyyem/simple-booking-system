"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUser } from "@/context/UserContext";

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const allLinks: NavLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: "D" },
    { href: "/profile", label: "Profile Detail", icon: "P" },
    { href: "/security", label: "Security", icon: "S" },
    { href: "/booking_histories", label: "Booking History", icon: "B" },
    { href: "/users", label: "User", icon: "U" },
  ];

  const filteredLinks = allLinks.filter((link) =>
    user?.isAdmin
      ? true
      : ["/profile", "/security", "/booking_histories"].includes(link.href),
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
    } catch (error) {
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="mx-2 my-2 flex flex-col gap-1">
      <div className="w-[100px] bg-gray-200 h-[100px] border-1 flex justify-center items-center rounded-[100px] mx-auto my-4">
        <div className="text-[40px]">
          {user?.username?.charAt(0).toUpperCase() || "?"}
        </div>
      </div>
      <div className="text-center text-[20px] bold">{user?.username}</div>
      <div className="text-center mb-4">{user?.email}</div>
      <hr className="my-2 border-gray-200" />
      {filteredLinks.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            className={`flex px-4 py-3 rounded-lg items-center gap-2 transition-colors duration-100
              ${isActive ? "bg-purple-500 text-white" : "text-gray-500 hover:bg-purple-500 hover:text-white"}`}
            href={link.href}
          >
            <span className="mx-2">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        );
      })}

      <hr className="my-2 border-gray-200" />

      <button
        className="w-full py-3 bg-red-600 text-white rounded-lg flex justify-center items-center gap-2 transition-colors duration-100
          hover:bg-red-700 disabled:opacity-50"
        disabled={isLoggingOut}
        onClick={handleLogout}
      >
        {isLoggingOut && (
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
        {isLoggingOut ? "Logging Out..." : "Log Out"}
      </button>
    </nav>
  );
}
