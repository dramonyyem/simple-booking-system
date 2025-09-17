"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@heroui/react";

import CustomLayout from "@/components/layout-custom";
import Navigation from "@/components/navigation";

type User = {
  username: string;
  email: string;
};

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
  });

  const [bookings, setBookings] = useState([]);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });

    if (res.ok) {
      localStorage.removeItem("username");
      router.push("/auth/login");
    }
  };
  const userInfomation = async () => {
    const res = await fetch("/api/auth/profile", {
      method: "GET",
    });
    const data = await res.json();

    setUser(data.user);
  };

  const booking_history = async () => {
    const res = await fetch("/api/booking_histories", {
      method: "GET",
    });
    const data = await res.json();

    setBookings(data.bookings);
  };

  useEffect(() => {
    userInfomation();
    booking_history();
  }, []);

  return (
    <CustomLayout>
      <div className="flex justify-center mx-auto w-7/10">
        <aside className="w-2/10 bg-white mt-2 mx-2 rounded-lg ">
          <Navigation />
        </aside>
        <div className="relative flex flex-col mt-2 mx-auto w-8/10 h-[750px] text-gray-700 border-1 border-gray-300 bg-white shadow-md rounded-xl bg-clip-border p-3">
          <div className="flex justify-between">
            {/* <div></div>
            <div>
              <button
                className="bg-red-500 text-white py-1 px-2 rounded-lg"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div> */}
          </div>
          <div className="py-2" />
          <div className="text-black text-[30px] px-2 pb-2">Dashboard</div>
          <hr className="border-gray-300 border-1" />
          <div className="px-2 py-2 grid grid-cols-2">
            <Card className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <Image
                  alt="heroui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md">HeroUI</p>
                  <p className="text-small text-default-500">heroui.com</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>
                  Make beautiful websites regardless of your design experience.
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link
                  isExternal
                  showAnchorIcon
                  href="https://github.com/heroui-inc/heroui"
                >
                  Visit source code on GitHub.
                </Link>
              </CardFooter>
            </Card>
            <Card className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <Image
                  alt="heroui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md">HeroUI</p>
                  <p className="text-small text-default-500">heroui.com</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>
                  Make beautiful websites regardless of your design experience.
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link
                  isExternal
                  showAnchorIcon
                  href="https://github.com/heroui-inc/heroui"
                >
                  Visit source code on GitHub.
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div />
        </div>
      </div>
    </CustomLayout>
  );
}
