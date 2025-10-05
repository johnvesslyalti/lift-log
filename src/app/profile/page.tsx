"use client";

import HandleLogout from "@/components/handle-logout";
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

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-5 flex flex-col items-center">
      {/* Profile Image */}
      <div className="flex items-center justify-center w-full p-5">
        {user.image ? (
          <Image
            src={user.image}
            width={150}
            height={150}
            alt="User Image"
            className="rounded-full mb-4"
          />
        ) : (
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-300 rounded-full text-3xl font-bold text-white">
            {user.name?.[0] ?? "U"}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center mb-5">
        <div className="font-bold text-lg">{user.name}</div>
        <div className="text-gray-600">{user.email}</div>
      </div>

      {/* Stats Cards */}
      <div className="flex items-center justify-center gap-5 mb-5 w-full max-w-md">
        <Card className="w-1/2">
          <CardHeader>Height</CardHeader>
          <CardContent>{user.height ?? "N/A"}</CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader>Weight</CardHeader>
          <CardContent>{user.weight ?? "N/A"}</CardContent>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="w-full flex justify-center">
        <HandleLogout />
      </div>
    </div>
  );
}
