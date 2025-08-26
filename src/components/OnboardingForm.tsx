"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";
type PrefillUser = {
  kakaoId: number;
  kakaoNickname: string;
  profileImageUrl: string;
};
export default function OnboardingForm() {
  const router = useRouter();
  const { setForm, setFile } = useOnboarding();

  const [nickname, setNickname] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<PrefillUser | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("prefill_user");
    if (raw) {
      const u = JSON.parse(raw);
      setPrefill(u);
      setNickname(u.kakaoNickname || "");
      setPreviewUrl(u.profileImageUrl || null);
    }
  }, []);

  const openPicker = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleNext = () => {
    if (!nickname.trim() || !prefill) return;
    setForm({
      kakaoId: prefill.kakaoId,
      kakaoNickname: prefill.kakaoNickname,
      profileImageUrl: prefill.profileImageUrl,
      nickname: nickname.trim(),
    });
    router.replace("/onboarding/survey");
  };

  return (
    <div className="relative w-full space-y-6">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={openPicker}
          className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-inner"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="프로필"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">사진 선택</span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded-2xl bg-gray-200/80 px-4 py-3 text-sm"
          maxLength={24}
        />
      </div>

      <div className="fixed inset-x-0 bottom-8 flex justify-center">
        <button
          type="button"
          onClick={handleNext}
          className="w-12 h-12 rounded-full border flex items-center justify-center bg-white shadow"
        >
          →
        </button>
      </div>
    </div>
  );
}
