"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";

export default function Page() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });

    if (res.ok) {
      localStorage.removeItem("username");
      router.push("/auth/login");
    }
  };

  const userInfomation = async () => {
    const res = await fetch("/api/auth/profile", { method: "GET" });
    const data = await res.json();
  };

  const fetchuser = async () => {
    const res = await fetch("/api/users", { method: "GET" });
    const users = await res.json();

    setUsers(users);
  };
  const booking_history = async () => {
    const res = await fetch("/api/booking_histories", { method: "GET" });
    const data = await res.json();

    setBookings(data.bookings);
  };

  useEffect(() => {
    userInfomation();
    booking_history();
    fetchuser();
  }, []);

  return (
    <CustomLayout>
      <div className="flex flex-col lg:flex-row justify-center mx-auto w-full lg:w-11/12 xl:w-7/10 gap-4">
        <aside className="w-full lg:w-1/4 bg-white mt-2 rounded-lg shadow-sm">
          <Navigation />
        </aside>

        <div className="flex-1 flex flex-col mt-2 bg-white shadow-md rounded-xl p-4 min-h-[500px] overflow-x-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="text-black text-2xl md:text-3xl font-semibold">
              Dashboard
            </div>
          </div>

          <hr className="border-gray-300 mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
              <p className="text-sm md:text-base">Total Bookings</p>
              <p className="text-2xl md:text-3xl font-bold">
                {bookings.length}
              </p>
            </div>
            <div className="bg-green-500 text-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
              <p className="text-sm md:text-base">Total Customers</p>
              <p className="text-2xl md:text-3xl font-bold">{users.length}</p>
            </div>
            <div className="bg-yellow-500 text-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
              <p className="text-sm md:text-base">Total Confirmed</p>
              <p className="text-2xl md:text-3xl font-bold">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
}
