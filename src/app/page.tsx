import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const token = (await cookies()).get("access_token")?.value;

  // 온보딩 여부는 필요 시 백엔드에서 따로 체크(예: /me)하세요.
  if (!token) {
    console.log("app/page.tsx에서 튕김");
    redirect("/login");
  }
  redirect("/dashboard");
}
