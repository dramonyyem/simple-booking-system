"use client";

import { useEffect, useState } from "react";

import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";

type User = {
  _id: string;
  username: string;
  email: string;
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <CustomLayout>
      <div className="flex flex-col lg:flex-row justify-center mx-auto w-full lg:w-11/12 xl:w-7/10 gap-4">
        <aside className="w-full lg:w-1/4 bg-white mt-2 rounded-lg shadow-sm">
          <Navigation />
        </aside>

        <div className="flex-1 flex flex-col mt-2 bg-white shadow-md rounded-xl p-4 min-h-[500px] overflow-x-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="text-black text-[30px]">User List</div>
            
          </div>
          <hr className="border-gray-300 mb-4" />

          <table className="w-full table-auto border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <th className="p-4 border border-gray-300">Name</th>
                <th className="p-4 border border-gray-300">Email</th>
                <th className="p-4 border border-gray-300">Joined</th>
                <th className="p-4 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    className="text-center p-4 border border-gray-300 text-gray-400"
                    colSpan={4}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-purple-50 transition">
                    <td className="p-4 border border-gray-300">
                      {user.username}
                    </td>
                    <td className="p-4 border border-gray-300">{user.email}</td>
                    <td className="p-4 border border-gray-300">23/04/18</td>
                    <td className="p-4 border border-gray-300">
                      <a
                        className="text-purple-600 hover:underline"
                        href={`/users/${user._id}`}
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CustomLayout>
  );
}
