"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const userFromStore = useUserStore((state) => state.user);
  const [user, setUser] = useState(userFromStore);

  useEffect(() => {
    if (userFromStore) setUser(userFromStore);
  }, [userFromStore]);

  if(!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-center w-full p-5">
        {/* Profile Image */}
        {user?.image ? (
          <Image
            src={user.image}
            width={150}
            height={150}
            alt="User Image"
            className="rounded-full mb-4"
          />
        ) : (
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-300 rounded-full text-3xl font-bold text-white">
            {user?.name?.[0] ?? "U"}
          </div>
        )}
      </div>
      <div className="flex flex-col w-full items-center justify-center">
        <div className="font-bold">{user.name}</div>
        <div className="">{user.email}</div>
      </div>
      <div className="flex items-center justify-center w-full gap-5 p-5">
        <Card className="w-1/4">
            <CardHeader>Height</CardHeader>
            <CardContent>90</CardContent>
        </Card>
        <Card className="w-1/4">
            <CardHeader>Weight</CardHeader>
            <CardContent>90</CardContent>
        </Card>
      </div>
    </div>
  );
}
