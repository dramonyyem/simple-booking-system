"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DatePicker } from "@heroui/date-picker";
import { DateValue } from "@react-types/datepicker";
import { Select, SelectItem, Textarea } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import toast from "react-hot-toast";

import { available_time } from "../../../data/availableTime";

import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";
import { formatDate } from "@/utils/function";
import Link from "next/link";

type Booking = {
  date: string;
  time: string;
  note: string;
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState<DateValue | null>(null);
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 NEW state

  const today = new Date();
  const todayValue = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  /** 🔹 Fetch booking from API */
  const findBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/bookings/${id}`, { method: "GET" });

      if (!res.ok) {
        const err = await res.json();

        setError(err.error || "Failed to fetch booking");

        return;
      }

      const data = await res.json();

      setBooking(data.booking);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Pre-fill form when booking is fetched */
  useEffect(() => {
    if (booking) {
      setNote(booking.note || "");
      setTime(booking.time || null);

      if (booking.date) {
        const d = new Date(booking.date);

        setDate(
          new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate()),
        );
      }
    }
  }, [booking]);

  useEffect(() => {
    findBooking();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataInput = formatDate(date);

    try {

      setIsSubmitting(true);

      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dataInput,
          time,
          note,
        }),
      });

      if (!res.ok) {
        const err = await res.json();

        alert(err.error || "Failed to update booking");

        return;
      }

      toast.success("Booking updated successfully!");
      router.push("/booking_histories");
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomLayout>
      <div className="flex justify-center mx-auto w-7/10">
        <aside className="w-2/10 bg-white h-[700px] mt-2 mx-2 rounded-lg">
          <Navigation />
        </aside>
        <div className="relative flex flex-col mt-2 mx-auto w-8/10 h-[700px] text-gray-700 border border-gray-300 bg-white shadow-md rounded-xl p-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-black text-2xl md:text-3xl font-semibold px-2 mb-2">
                Booking History
            </h2>
            <div className="text-gray-400 hover:underline flex justify-center items-center">
                <div className="px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                    </svg>
                </div>
                <div>
                    <p>
                        <Link href="/booking_history">
                            Back
                        </Link>
                        
                    </p>
                </div>
                
            </div>
            
          </div>
          <div className="px-2">Updated Your Booking No. {id} </div>
          {loading && <div className="p-6">Loading booking...</div>}
          {error && <div className="p-6 text-red-500">{error}</div>}

          {booking && (
            <form className="" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2">
                <div className="pt-4 px-2">
                  <DatePicker
                    className="max-w-full"
                    label="Booking date"
                    minValue={todayValue}
                    value={date}
                    onChange={setDate}
                  />
                </div>

                <div className="pt-4 px-2">
                  <Select
                    className="max-w-full"
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
                </div>

                <div className="pt-4 px-2 col-span-2">
                  <Textarea
                    className="max-w-full"
                    label="Note"
                    maxRows={5}
                    placeholder="Enter your Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-[100px]">
                <button
                  className="p-2 mt-2 bg-purple-500 text-white rounded-lg w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting && (
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
                  {isSubmitting ? "Updating..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </CustomLayout>
  );
}
