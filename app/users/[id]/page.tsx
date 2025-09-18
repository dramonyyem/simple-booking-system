"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

import Navigation from "@/components/navigation";
import CustomLayout from "@/components/layout-custom";

type User = {
  title?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  address?: string;
  phone?: string;
  isAdmin?: boolean;
};

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [editingField, setEditingField] = useState<keyof User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      setUser(data.user);
    } catch (err) {
      console.error("Profile fetch error:", err);
      alert("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async (field: keyof User) => {
    if (!user) return;

    try {
      if (field === "phone" && !/^\d*$/.test(user.phone ?? "")) {
        alert("Phone number must be numeric");

        return;
      }

      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, [field]: user[field] ?? "" }),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();

      setUser(data.user);
      toast.success("User Updated");

      setEditingField(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update user");
    }
  };

  const renderField = (label: string, field: keyof User) => {
    if (!user) return null;
    const value =
      typeof user[field] === "string" ? (user[field] as string) : "";

    return (
      <div
        key={field}
        className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between px-2 py-3 border-b border-gray-200 gap-2"
      >
        <div className="sm:w-1/4 font-medium text-gray-700">{label}</div>
        <div className="flex flex-col sm:flex-row sm:w-3/4 gap-2 sm:gap-3 w-full">
          <input
            className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
              ${
                editingField === field
                  ? "border-blue-400 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-600"
              }`}
            disabled={editingField !== field}
            type="text"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
          />
          {editingField === field ? (
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg font-semibold transition-colors"
              onClick={() => handleSave(field)}
            >
              Save
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold transition-colors"
              onClick={() => setEditingField(field)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <CustomLayout>
      <Toaster position="top-center" />
      <div className="flex flex-col lg:flex-row justify-center mx-auto w-full lg:w-11/12 xl:w-7/10 gap-4">
        <aside className="w-full lg:w-1/4 bg-white mt-2 rounded-lg shadow-sm">
          <Navigation />
        </aside>

        <div className="flex-1 flex flex-col mt-2 bg-white shadow-md rounded-xl p-4 min-h-[500px] overflow-x-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-black text-2xl md:text-3xl font-semibold px-2 mb-2">
              User Details
            </h2>
            <div className="text-gray-400 hover:underline flex justify-center items-center">
              <div className="px-2">
                <svg
                  className="bi bi-chevron-left"
                  fill="currentColor"
                  height="16"
                  viewBox="0 0 16 16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p>
                  <Link href="/users">Back</Link>
                </p>
              </div>
            </div>
          </div>

          <p className="px-2 mb-4 text-gray-500">Update User Information</p>

          {renderField("Title", "title")}
          {renderField("First Name", "firstName")}
          {renderField("Last Name", "lastName")}
          {renderField("E-mail", "email")}
          {renderField("Address", "address")}
          {renderField("Phone", "phone")}
        </div>
      </div>
    </CustomLayout>
  );
}
