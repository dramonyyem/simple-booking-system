"use client";

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/check_available");

  // const router = useRouter();

  // useEffect(() => {
  //   router.push("/check_available");
  // },[]);


  // return (
  //   <div className="h-screen flex justify-center items-center text-black">
  //       <div className="text-center">
  //         <div className="text-[30px]">
  //             Ops!!! There is no action Appear due to this page 
  //         </div>
  //         <a href="/check_available" className="text-purple-500 hover:underline">
  //           CLICK HERE TO RETURN TO MAIN PAGE
  //         </a>
  //       </div>

  //   </div>
  // )
}
