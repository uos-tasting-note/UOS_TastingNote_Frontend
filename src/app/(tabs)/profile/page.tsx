"use client";

import { apiFetch } from "@/utils/api";
import { useEffect, useState } from "react";
import Image from "next/image";
import MyNotes from "@/components/profile/MyNotes";
import Management from "@/components/profile/Management";

type Preference = { tagId: number; name: string; aiRecommended: boolean };

type UserResponse = {
  kakaoId: number;
  nickname: string;
  kakaoNickname: string;
  profileImageUrl: string;
  createdAt: string;
  preferences: Record<string, Preference[]>;
};

type Note = {
  noteId: number;
  name: string;
  rating: number;
  photo: string;
  date: string;
};

const CATEGORIES = ["coffee", "tea", "wine", "whiskey", "other"];

export default function ProfilePage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [tab, setTab] = useState<"notes" | "management">("notes");

  async function loadProfile() {
    const res = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/me`
    );
    if (!res) return;
    const json = await res.json();
    if (json.status === 200) setUser(json.data);
  }

  async function loadNotes() {
    const results: Record<string, Note[]> = {};
    for (const c of CATEGORIES) {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my/notes/${c}`
      );
      if (!res) continue;
      const json = await res.json();
      if (json.status === 200) results[c] = json.data;
    }
    setNotes(results);
  }

  useEffect(() => {
    loadProfile();
    loadNotes();
  }, []);

  if (!user) return <div className="p-6">프로필 불러오는 중...</div>;

  return (
    <main className="p-6 space-y-2">
      {/* 상단 프로필 */}
      <div className="flex items-center space-x-4 mt-5 w-full">
        <div className="mr-auto mb-2">
          <h2 className="text-3xl font-semibold">{user.nickname}</h2>
          <p className="text-sm text-gray-500 mb-3">{user.kakaoNickname}</p>
          <div className="w-full flex flex-wrap gap-2 max-w-[270px]">
            {user.preferences &&
              Object.values(user.preferences)
                .flat()
                .sort((a, b) => a.name.length - b.name.length)
                .map((t) => (
                  <span
                    key={t.tagId}
                    className="px-3 py-1 text-xs rounded-full bg-[#7B2D2D] text-white"
                  >
                    {t.name}
                  </span>
                ))}
          </div>
        </div>
        <div className="flex flex-col items-center h-40">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-auto">
            <Image
              src={user.profileImageUrl}
              alt={user.nickname}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-row gap-2">
            <button>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 4h12a1 1 0 0 1 1 1v16l-7-5-7 5V5a1 1 0 0 1 1-1z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 탭 버튼 */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setTab("notes")}
          className={`pb-2 w-full ${
            tab === "notes"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-400"
          }`}
        >
          내 노트
        </button>
        <button
          onClick={() => setTab("management")}
          className={`pb-2 w-full ${
            tab === "management"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-400"
          }`}
        >
          관리
        </button>
      </div>

      {/* 탭 뷰 */}
      {tab === "notes" ? <MyNotes notes={notes} /> : <Management user={user} />}
    </main>
  );
}
