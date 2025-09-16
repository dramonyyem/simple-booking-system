'use client';

import { useState } from "react";
import {DatePicker} from "@heroui/date-picker";
import { DateValue } from "@react-types/datepicker";
import { formatDate } from "@/utils/function";
import { Select, SelectItem } from "@heroui/react";
import {Textarea} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import CustomLayout from "@/components/layout-custom";



export const available_time = [
  { key: "02:00 PM", label: "02:00 PM" },
  { key: "04:00 PM", label: "04:00 PM" },
]; 

export default function Page() {
    const [time, setTime] = useState<string | null>(null);
    const [date, setDate] = useState<DateValue | null>(null);
    const [note, setNote] = useState("");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // HeroUI uses DateValue, so we create CalendarDate
    const todayValue = new CalendarDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
    );
    const tomorrowValue = new CalendarDate(
        tomorrow.getFullYear(),
        tomorrow.getMonth() + 1,
        tomorrow.getDate()
    );
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        const dateInput = formatDate(date);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dateInput, time , note }),
            })
            const data = await res.json();
            console.log(data)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <CustomLayout>
            <div className="my-8  flex justify-center ">
                <div className="bg-white border-1 border-gray-purple p-5 rounded-lg shadow-fuchsia-200 shadow-lg">
                    <div className="text-[20px] text-purple-500 px-2 py-[20px]">
                        Make Booking
                    </div>
                    <form onSubmit={handleSubmit} className="w-[400px]">
                        <div className="pt-4">
                            <DatePicker className="max-w-full" 
                                label="Booking date"   
                                value={date}
                                onChange={setDate}
                                minValue={todayValue}  
                            />
                        </div>
                        <div className="pt-4">
                            <Select
                                className="max-w-full"
                                label="Booking Hour"
                                placeholder="Select Booking hour"
                                selectionMode="single"
                                selectedKeys={time ? new Set([time]) : new Set()}
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
                        <div className="pt-4">
                            <Textarea 
                                className="max-w-full" 
                                label="Note" 
                                placeholder="Enter your Note" 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                maxRows={5}
                            />
                        </div>

                        <div className="pt-[300px]">
                            <button className='p-2 mt-2 bg-purple-500 rounded-lg w-full' type='submit'>
                                Submit
                            </button>
                        </div>  
                        
                    </form>
                </div>
            </div>
        </CustomLayout>            


    )
}