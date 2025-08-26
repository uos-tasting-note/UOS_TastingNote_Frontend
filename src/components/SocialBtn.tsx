"use client";

export default function SocialBtn() {
  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
  const KAKAO_AUTH_URI =
    `https://kauth.kakao.com/oauth/authorize` +
    `?response_type=code&client_id=${encodeURIComponent(REST_API_KEY)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  const loginHandler = () => {
    window.location.href = KAKAO_AUTH_URI;
  };

  return (
    <button
      onClick={loginHandler}
      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-xl font-bold shadow-sm transition hover:shadow disabled:opacity-60"
      style={{ backgroundColor: "#FEE500" }}
    >
      {/* Kakao 심볼 */}
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="#000" />
      </svg>
      카카오 계정으로 로그인
    </button>
  );
}
