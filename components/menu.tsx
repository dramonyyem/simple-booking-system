"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useUser } from "@/context/UserContext";

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export default function Menu() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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

  const profileActive = allLinks.some(
    (link) => pathname === link.href || pathname.startsWith(link.href + "/"),
  );

  return (
    <div className="py-6 bg-white w-full shadow-lg flex justify-between items-center px-4">
      <div className="text-purple-500 flex">
        <Link href="/check_available">SIMPLE - BOOKING - SYSTEM</Link>
      </div>

      <div className="flex items-center">
        <div className="h-[30px] text-gray-500">
          {user?.username ? (
            <Link
              className={
                profileActive
                  ? "font-bold text-purple-500"
                  : "hover:text-purple-500"
              }
              href="/profile"
            >
              {user.username}
            </Link>
          ) : (
            <Link href="/auth/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
}
