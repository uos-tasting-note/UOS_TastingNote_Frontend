import { Metadata } from "next";
import Image from "next/image";
import SocialBtn from "@/components/SocialBtn";
export const metadata: Metadata = {
  title: "로그인 | MyApp",
};

export default function LoginPage() {
  return (
    <main
      className="w-screen h-screen flex items-center justify-center flex-col pt-60"
      style={{ backgroundColor: "#853339" }}
    >
      <Image
        src="/Logo.png"
        alt="TastingNote"
        width={220}
        height={220}
        priority
      />
      <div className="w-full h-60 max-w-md pt-40 p-10">
        <div className="space-y-3">
          <SocialBtn />
        </div>
      </div>
    </main>
  );
}
