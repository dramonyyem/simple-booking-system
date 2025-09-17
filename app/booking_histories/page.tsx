"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { DatePicker } from "@heroui/date-picker";

import { formatDate } from "@/utils/function";
import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";

type User = {
  username: string;
};

type Booking = {
  _id: string;
  date: string;
  time: string;
  user: User;
};

export default function BookingHistoriesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  const [search, setSearch] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/booking_histories", { method: "GET" });
      const data = await res.json();

      setBookings(data.bookings);
      setFilteredBookings(data.bookings);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter((booking) => {
      const rowString = Object.values(booking)
        .map((val) =>
          typeof val === "object" ? JSON.stringify(val) : String(val),
        )
        .join(" ")
        .toLowerCase();
      const matchesSearch = rowString.includes(search.toLowerCase());

      const matchesUsername = booking.user.username
        .toLowerCase()
        .includes(usernameFilter.toLowerCase());

      // Date filter
      const matchesDate = dateFilter
        ? booking.date === formatDate(dateFilter)
        : true;

      return matchesSearch && matchesUsername && matchesDate;
    });

    setFilteredBookings(filtered);
  }, [bookings, search, usernameFilter, dateFilter]);

  return (
    <CustomLayout>
      <div className="flex justify-center mx-auto w-7/10">
        <aside className="w-2/10 bg-white mt-2 mx-2 rounded-lg">
          <Navigation />
        </aside>

        <div className="relative flex flex-col mt-2 mx-auto w-8/10 h-[750px] text-gray-700 border border-gray-300 bg-white shadow-md rounded-xl p-4">
          <Toaster position="top-center" />

          <div className="text-black text-[30px] px-2 mt-4 mb-2">
            Booking Histories
          </div>
          <hr className="border-gray-300 mb-4" />

          <div className="flex flex-wrap gap-4 py-2 items-end">
            <input
              className="flex-1 min-w-[200px] px-4 py-3 rounded-[10px] bg-gray-100 border border-gray-300"
              placeholder="Search all fields..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              className="min-w-[200px] px-4 py-3 rounded-[10px] bg-gray-100 border border-gray-300"
              placeholder="Filter by username"
              type="text"
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
            />

            <DatePicker
              className="min-w-[200px]"
              label="Booking date"
              value={dateFilter}
              onChange={setDateFilter}
            />
          </div>

          <table className="w-full table-auto border-collapse border border-gray-300 text-left mt-4">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <th className="p-4 border border-gray-300">Time</th>
                <th className="p-4 border border-gray-300">Date</th>
                <th className="p-4 border border-gray-300">Booking No.</th>
                <th className="p-4 border border-gray-300">Username</th>
                <th className="p-4 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    className="text-center p-4 border border-gray-300 text-gray-400"
                    colSpan={5}
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-purple-50 transition"
                  >
                    <td className="p-4 border border-gray-300">
                      {booking.time}
                    </td>
                    <td className="p-4 border border-gray-300">
                      {booking.date}
                    </td>
                    <td className="p-4 border border-gray-300">
                      {booking._id}
                    </td>
                    <td className="p-4 border border-gray-300">
                      {booking.user.username}
                    </td>
                    <td className="p-4 border border-gray-300">
                      <a
                        className="text-purple-600 hover:underline"
                        href={`/booking_histories/${booking._id}`}
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CustomLayout>
  );
}
