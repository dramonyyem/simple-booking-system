"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";

type User = {
  _id: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  address?: string;
  phone?: string;
  isAdmin?: boolean;
};

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  // Fetch user profile
  const userInformation = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();

      setUser(data.user);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    userInformation();
  }, []);

  // Update field locally
  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // Save updated field to backend
  const handleSave = async (field: keyof User) => {
    try {
      // Validate phone is numeric
      if (field === "phone" && !/^\d*$/.test(user.phone ?? "")) {
        alert("Phone number must be numeric");

        return;
      }

      // Send PATCH request with the updated field
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          [field]: user[field] ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update user");
      } else {
        // Update user state with returned user object
        setUser(data);
        setEditingField(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  // Render editable field
  const renderField = (label: string, field: keyof User) => {
    const getValue = () => {
      const value = user[field];

      return typeof value === "string" ? value : "";
    };

    return (
      <div className="px-2 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="w-2/10 font-medium text-gray-700">{label}</div>
        <div className="flex items-center w-8/10 gap-3">
          <input
            className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
              ${
                editingField === field
                  ? "border-blue-400 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-600"
              }`}
            disabled={editingField !== field}
            type="text"
            value={getValue()}
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
      <div className="flex justify-center mx-auto w-7/10">
        <aside className="w-2/10 bg-white mt-2 mx-2 rounded-lg shadow-sm">
          <Navigation />
        </aside>
        <div className="relative flex flex-col mt-2 mx-auto w-8/10 text-gray-700 border border-gray-200 bg-white shadow-lg rounded-xl p-4">
          <div className="text-black text-2xl font-semibold px-2">
            Personal Details
          </div>
          <div className="px-2 mb-4 text-gray-500">Update Your Information</div>

          {renderField("Title", "title")}
          {renderField("First Name", "firstName")}
          {renderField("Last Name", "lastName")}
          {renderField("Username", "username")}
          {renderField("E-mail", "email")}
          {renderField("Address", "address")}
          {renderField("Phone", "phone")}
        </div>
      </div>
    </CustomLayout>
  );
}
