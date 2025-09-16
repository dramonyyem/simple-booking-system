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
  const today = new Date();
  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const todayValue = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
  // const tomorrowValue = new CalendarDate(
  //     tomorrow.getFullYear(),
  //     tomorrow.getMonth() + 1,
  //     tomorrow.getDate()
  // );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <CustomLayout>
      <div className="my-4 flex justify-center items-center">
        <div className="bg-white border-1 border-gray-purple p-5 rounded-lg shadow-fuchsia-200 shadow-lg">
          <div className="text-[20px] text-purple-500 px-2 py-[20px]">
            Check Available Date time
          </div>
          <form
            className="w-[600px] flex justify-center items-center"
            onSubmit={handleSubmit}
          >
            <div>
              <DatePicker
                className="w-[450px] "
                label="Booking date"
                minValue={todayValue}
                value={date}
                onChange={setDate}
              />
            </div>

            <div className="">
              <button
                className="p-4 ml-1 bg-purple-500 rounded-lg w-[140px]"
                type="submit"
              >
                CHECK
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="my-4 flex justify-center items-center">
        <div className="bg-white border-1 p-5 border-gray-purple rounded-lg shadow-fuchsia-200 shadow-lg">
          <div className="text-gray-400">Time Available for Booking</div>
          <div className="text-[20px] text-purple-500 px-2 py-[20px] w-[600px]">
            <div>
              {available.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {available.map((t) => (
                    <a
                      key={t.key}
                      className="border rounded-lg p-2 border-amber-300 text-center hover:bg-purple-600 hover:text-white cursor-pointer"
                      href="/auth/login"
                    >
                      {t.label}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center">No Item inside this list</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
}
