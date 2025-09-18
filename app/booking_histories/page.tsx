"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { DatePicker } from "@heroui/date-picker";
import Link from "next/link";
import toast from "react-hot-toast";

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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.status === 200) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
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
      const matchesDate = dateFilter
        ? booking.date === formatDate(dateFilter)
        : true;

      return matchesSearch && matchesUsername && matchesDate;
    });

    setFilteredBookings(filtered);
    setCurrentPage(1); // reset to first page when filtering
  }, [bookings, search, usernameFilter, dateFilter]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  return (
    <CustomLayout>
      <div className="flex flex-col lg:flex-row justify-center mx-auto w-full lg:w-11/12 xl:w-7/10 gap-4">
        <aside className="w-full lg:w-1/4 bg-white mt-2 min-h-[500px] rounded-lg shadow-sm">
          <Navigation />
        </aside>
        <div className="flex-1 flex flex-col mt-2 bg-white shadow-md rounded-xl p-4 min-h-[500px] overflow-x-auto">
          <Toaster position="top-center" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 px-2">
            <h1 className="text-black text-2xl md:text-3xl font-semibold">
              Booking Histories
            </h1>
            <Link
              className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
              href="/bookings"
            >
              Add Booking
            </Link>
          </div>

          <hr className="border-gray-300 mb-4" />

          <div className="flex flex-wrap gap-4 py-2 items-end">
            <input
              className="flex-1 min-w-[150px] px-4 py-2 rounded-lg bg-gray-100 border border-gray-300"
              placeholder="Search all fields..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              className="min-w-[150px] px-4 py-2 rounded-lg bg-gray-100 border border-gray-300"
              placeholder="Filter by username"
              type="text"
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
            />
            <DatePicker
              className="min-w-[150px]"
              label="Booking date"
              value={dateFilter}
              onChange={setDateFilter}
            />
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full table-auto border-collapse border border-gray-300 text-left">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <th className="p-3 border border-gray-300">Time</th>
                  <th className="p-3 border border-gray-300">Date</th>
                  <th className="p-3 border border-gray-300">Booking No.</th>
                  <th className="p-3 border border-gray-300">Username</th>
                  <th className="p-3 border border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td
                      className="text-center p-4 border border-gray-300 text-gray-400"
                      colSpan={5}
                    >
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-purple-50 transition"
                    >
                      <td className="p-3 border border-gray-300">
                        {booking.time}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {booking.date}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {booking._id}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {booking.user.username}
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex gap-2 flex-wrap">
                          <Link
                            className="text-purple-600 hover:underline"
                            href={`/booking_histories/${booking._id}`}
                          >
                            Edit
                          </Link>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDelete(booking._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </CustomLayout>
  );
}
