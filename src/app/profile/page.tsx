'use client'

import HandleLogout from "@/components/handle-logout";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const userFromStore = useUserStore((state) => state.user);
  const [user, setUser] = useState(userFromStore);

  useEffect(() => {
    if (userFromStore) setUser(userFromStore);
  }, [userFromStore]);

  if (!user) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen justify-center items-center p-5">
        <div className="w-full mx-auto bg-black">
            <Image 
            src={user.image ?? user.name[0]} 
            width={150} 
            height={150} 
            alt="user Image"
            className="rounded-full bg-white"
            />
        </div>
    </div>
  );
}
