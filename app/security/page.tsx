"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";

type User = {
  _id: string;
  username: string;
  email: string;
  password?: string;
};

interface UpdateUserPayload {
  userId: string;
  username?: string;
  password?: string;
}

export default function SecurityPage() {
  const router = useRouter();

  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
    password: "",
  });

  const [originalUser, setOriginalUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
    password: "",
  });

  const [token, setToken] = useState<string>("");
  const [editingField, setEditingField] = useState<
    "username" | "password" | null
  >(null);
  const [loading, setLoading] = useState(false);

  // Fetch user profile
  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/auth/profile");

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      const fetchedUser = {
        _id: data.user._id || "",
        username: data.user.username || "",
        email: data.user.email || "",
        password: "",
      };

      setUser(fetchedUser);
      setOriginalUser(fetchedUser); // Keep a copy to reset on cancel
      setToken(data.payload?.token || data.token || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // Reset JWT token
  const handleResetToken = async () => {
    try {
      const res = await fetch("/api/auth/reset-token", { method: "POST" });

      if (!res.ok) throw new Error("Failed to reset token");
      const data = await res.json();

      setToken(data.token || "");
      toast.success("Token has been reset!");
    } catch (err) {
      toast.error("Failed to reset token");
    }
  };

  // Save username or password
  const handleSaveField = async (field: "username" | "password") => {
    if (!user._id) return;

    setLoading(true);

    try {
      const payload: UpdateUserPayload = { userId: user._id };

      if (field === "username") {
        if (!user.username.trim()) {
          toast.error("Username cannot be empty");
          setLoading(false);

          return;
        }
        payload.username = user.username.trim();
      } else if (field === "password") {
        if (!user.password) {
          toast.error("Password cannot be empty");
          setLoading(false);

          return;
        }
        payload.password = user.password;
      }

      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Update successful!");
        setUser((prev) => ({ ...prev, password: "" }));
        setOriginalUser((prev) => ({ ...prev, username: user.username }));
        setEditingField(null);
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (field: "username" | "password") => {
    setEditingField(null);
    if (field === "username") {
      setUser((prev) => ({ ...prev, username: originalUser.username }));
    } else if (field === "password") {
      setUser((prev) => ({ ...prev, password: "" }));
    }
  };

  const renderField = (
    label: string,
    field: "username" | "password" | "token",
    readOnly = false,
    type: "text" | "password" = "text",
  ) => {
    const value = field === "token" ? token : user[field] || "";

    return (
      <div
        key={field}
        className="px-2 py-3 flex items-center justify-between border-b border-gray-200"
      >
        <div className="w-3/10 font-medium text-gray-700">{label}</div>
        <div className="flex items-center w-7/10 gap-3">
          <input
            className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
              editingField === field && !readOnly
                ? "border-blue-400 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-600"
            }`}
            disabled={readOnly || editingField !== field || loading}
            type={type}
            value={value}
            onChange={(e) =>
              field !== "token" &&
              handleChange(field as keyof User, e.target.value)
            }
          />

          {!readOnly &&
            field !== "token" &&
            (editingField === field ? (
              <div className="flex gap-2">
                <button
                  className={`bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg font-semibold transition-colors ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() =>
                    handleSaveField(field as "username" | "password")
                  }
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-lg font-semibold transition-colors"
                  onClick={() =>
                    handleCancelEdit(field as "username" | "password")
                  }
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold transition-colors"
                onClick={() =>
                  setEditingField(field as "username" | "password")
                }
              >
                Edit
              </button>
            ))}

          {field === "token" && (
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg font-semibold transition-colors"
              onClick={handleResetToken}
            >
              Reset
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
          <div className="text-black text-2xl font-semibold px-2">
            Security Settings
          </div>
          <div className="px-2 mb-4 text-gray-500">
            Update your login information
          </div>

          {renderField("Username", "username")}
          {renderField("Password", "password", false, "password")}
          {renderField("Token", "token", true, "password")}
        </div>
      </div>
    </CustomLayout>
  );
}
