"use client";

import { useState } from "react";
import { DatePicker } from "@heroui/date-picker";
import { DateValue } from "@react-types/datepicker";
import { CalendarDate } from "@internationalized/date";

import { formatDate } from "@/utils/function";
import CustomLayout from "@/components/layout-custom";

type Time = {
  key: string;
  label: string;
};

export default function Page() {
  const [date, setDate] = useState<DateValue | null>(null);
  const [available, setAvailable] = useState<Time[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState([]);
  const today = new Date();

  const todayValue = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setIsLoading(true);
    setAvailable([]);
    const dateInput = formatDate(date);

    try {
      const res = await fetch("/api/check_available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateInput }),
      });

      if (!res.ok) throw new Error("Failed to fetch availability");
      const data = await res.json();

      setAvailable(data.time || []);

      setDisplay(data.bookings);

      console.log(display)

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomLayout>
      <div className="my-6 flex justify-center">
        <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-lg w-[650px]">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4 text-center">
            Check Available Booking Time
          </h2>
          <form
            className="flex gap-4 justify-center items-center flex-wrap"
            onSubmit={handleSubmit}
          >
            <DatePicker
              className="w-[300px]"
              label="Booking Date"
              minValue={todayValue}
              value={date}
              onChange={setDate}
            />
            <button
              className="px-6 py-3 bg-purple-500 text-white rounded-lg flex items-center gap-2 hover:bg-purple-600 transition disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
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
              {isLoading ? "Checking..." : "CHECK"}
            </button>
          </form>
        </div>
      </div>

      <div className="my-6 flex justify-center">
        <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-lg w-[650px]">
          <h3 className="text-gray-500 text-sm mb-2">
            Time Available for Booking
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <svg
                className="animate-spin h-8 w-8 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
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
            </div>
          ) : available.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {available.map((t) => (
                <a
                  key={t.key}
                  className="text-center border border-purple-300 rounded-lg py-2 px-3 hover:bg-purple-600 hover:text-white transition cursor-pointer"
                  href="/bookings"
                >
                  {t.label}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              No available times for the selected date.
            </div>
          )}
        </div>
      </div>
    </CustomLayout>
  );
}
