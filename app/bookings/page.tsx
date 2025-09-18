"use client";

import { useState } from "react";
import { DatePicker } from "@heroui/date-picker";
import { DateValue } from "@react-types/datepicker";
import { Select, SelectItem, Textarea } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import toast, { Toaster } from "react-hot-toast";

import { available_time } from "../../data/availableTime";

import CustomLayout from "@/components/layout-custom";
import { formatDate } from "@/utils/function";

export default function Page() {
  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState<DateValue | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const today = new Date();
  const todayValue = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const dateInput = formatDate(date);

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateInput, time, note }),
      });
      const data = await res.json();

      if (data.status === 401) {
        toast.error(data.message);
      }

      if (data.status === 200) {
        toast.success(data.message);
        setDate(null);
        setTime(null);
        setNote("");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomLayout>
      <Toaster position="top-center" />

      <div className="my-8 flex justify-center px-4">
        <div className="bg-white rounded-lg shadow-fuchsia-200 shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl p-6">
          <div className="text-[20px] font-semibold text-purple-500 text-center mb-6">
            Make Booking
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <DatePicker
              className="w-full"
              label="Booking date"
              minValue={todayValue}
              value={date}
              onChange={setDate}
            />

            <Select
              className="w-full"
              label="Booking Hour"
              placeholder="Select Booking hour"
              selectedKeys={time ? new Set([time]) : new Set()}
              selectionMode="single"
              onSelectionChange={(keys) => {
                if (typeof keys !== "string") {
                  const firstKey = Array.from(keys)[0];

                  setTime(firstKey ? String(firstKey) : null);
                }
              }}
            >
              {available_time.map((t) => (
                <SelectItem key={t.key}>{t.label}</SelectItem>
              ))}
            </Select>

            <Textarea
              className="w-full"
              label="Note"
              maxRows={5}
              placeholder="Enter your Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                className={`p-3 rounded-lg w-full text-white transition
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"}
                `}
                disabled={loading}
                type="submit"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                className="p-3 bg-gray-300 text-black rounded-lg w-full hover:bg-gray-400 transition"
                disabled={loading} // optional: disable reset while submitting
                type="button"
                onClick={() => {
                  setDate(null);
                  setTime(null);
                  setNote("");
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </CustomLayout>
  );
}
