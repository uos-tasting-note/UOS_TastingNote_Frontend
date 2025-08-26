"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TabBar from "@/components/TabBar";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("클라이언트에서 튕김");
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1 pb-20 ">{children}</div>
      <TabBar />
    </div>
  );
}
