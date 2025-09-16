"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomLayout from "@/components/layout-custom";

type User = {
  username: string;
  email: string;
};

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
  });

  const [bookings, setBookings] = useState([]);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      localStorage.removeItem("username");
      router.push("/auth/login");
    }
  };
  const userInfomation = async () => {
    const res = await fetch("/api/auth/profile", {
      method: "GET",
    });
    const data = await res.json();
    setUser(data.user);
  };

  const booking_history = async () => {
    const res = await fetch("/api/booking_histories", {
      method: "GET",
    });
    const data = await res.json();
    setBookings(data.bookings);
  };
  useEffect(() => {
    userInfomation();
    booking_history();
  }, []);

  return (
    <CustomLayout>
      <div className="relative flex flex-col mx-auto w-7/10 mt-2 text-gray-700 border-1 border-gray-300 bg-white shadow-md rounded-xl bg-clip-border p-3">
        <div className="flex justify-between">
          <div>Profile</div>
          <div>
            <button
              className="bg-red-500 text-white py-1 px-2 rounded-lg"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
        <div className="py-2"></div>
        <div>
          <div className="">Username :</div>
          <div className="text-[30px] text-black">{user.username}</div>
        </div>
        <div className="">email :</div>
        <div className="text-[30px] text-black">{user.email}</div>
        <div></div>
      </div>
      <div>
        <div className="relative flex flex-col mx-auto w-7/10 min-h-[80px] text-gray-700 border-1 border-gray-300 bg-white shadow-md rounded-xl bg-clip-border p-3 mt-2">
          <div>Booking History</div>
        </div>
      </div>
    </CustomLayout>
  );
}
