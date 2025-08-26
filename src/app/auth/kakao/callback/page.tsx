"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KakaoCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      router.replace("/login?error=no_code");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/kakao?code=${code}`,
          { method: "GET" }
        );
        const json = await res.json();
        const data = json.data;

        if (data?.isNewUser) {
          // 신규 → 온보딩으로 이동, 기본값 전달
          sessionStorage.setItem("prefill_user", JSON.stringify(data.userInfo));
          router.replace("/onboarding");
        } else if (data?.accessToken) {
          // 기존 → 토큰 저장 후 대시보드
          localStorage.setItem("access_token", data.accessToken);
          router.replace("/dashboard");
        }
      } catch (e) {
        console.error(e);
        router.replace("/login?error=exchange_failed");
      }
    })();
  }, [router]);

  return <p>카카오 로그인 처리중...</p>;
}
