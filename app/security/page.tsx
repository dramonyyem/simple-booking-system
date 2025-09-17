"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";

type User = {
  _id: string;
  username: string;
  email: string;
};

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
  });

  const [token, setToken] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);

  // Logout
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });

    if (res.ok) {
      localStorage.removeItem("username");
      router.push("/auth/login");
    }
  };

  // Fetch user profile and token
  const userInformation = async () => {
    const res = await fetch("/api/auth/profile", { method: "GET" });

    if (!res.ok) return;
    const data = await res.json();

    setUser(data.user);
    setToken(data.payload?.token || data.token || ""); // support token from payload or response
  };

  useEffect(() => {
    userInformation();
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (
    label: string,
    field: keyof User,
    value?: string,
    readOnly = false,
  ) => (
    <div className="px-2 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="w-3/10 font-medium text-gray-700">{label}</div>
      <div className="flex items-center w-7/10 gap-3">
        <input
          className={`w-full px-3 py-2 rounded-lg border transition-all duration-200
            ${
              editingField === field && !readOnly
                ? "border-blue-400 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-600"
            }`}
          disabled={readOnly || editingField !== field}
          type={field === "username" ? "text" : "text"}
          value={value ?? user[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        />
        {!readOnly &&
          (editingField === field ? (
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg font-semibold transition-colors"
              onClick={() => setEditingField(null)}
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
          ))}
      </div>
    </div>
  );

  return (
    <CustomLayout>
      <div className="flex justify-center mx-auto w-7/10">
        <aside className="w-2/10 bg-white mt-2 mx-2 rounded-lg shadow-sm">
          <Navigation />
          <div className="px-4 py-2 mt-4">
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </aside>

        <div className="relative flex flex-col mt-2 mx-auto w-8/10 text-gray-700 border border-gray-200 bg-white shadow-lg rounded-xl p-6">
          <div className="text-black text-2xl font-semibold px-2">
            Security Settings
          </div>
          <div className="px-2 mb-4 text-gray-500">
            Update your login information
          </div>
          {renderField("Username", "username")}
          {renderField("Token", "email", token, true)} {/* read-only token */}
        </div>
      </div>
    </CustomLayout>
  );
}
