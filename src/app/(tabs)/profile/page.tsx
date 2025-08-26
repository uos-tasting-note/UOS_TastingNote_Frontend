"use client";
import { apiFetch } from "@/utils/api";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  async function loadProfile() {
    const res = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/me`
    );
    if (!res) return; // 401일 경우 이미 redirect 됨

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

  function Stars({ n }: { n: number }) {
    const arr = Array.from({ length: 5 }, (_, i) => i < n);
    return (
      <div className="flex items-center gap-0.5">
        {arr.map((on, i) => (
          <svg
            key={i}
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={on ? "currentColor" : "none"}
            className={on ? "text-amber-400" : "text-gray-300"}
          >
            <path
              d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 20.9 7.3 14.4 2.6 9.8l6.5-.9L12 3z"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        ))}
      </div>
    );
  }

  if (!user) return <div className="p-6">프로필 불러오는 중...</div>;

  return (
    <main className="p-6 space-y-6">
      {/* 상단 프로필 */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={user.profileImageUrl}
            alt={user.nickname}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.nickname}</h2>
          <p className="text-sm text-gray-500">{user.kakaoNickname}</p>
        </div>
      </div>

      {/* 취향 태그 */}
      <div className="space-y-2">
        {Object.entries(user.preferences).map(([category, tags]) => (
          <div key={category}>
            <p className="text-sm font-medium mb-1">{category}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.tagId}
                  className="px-3 py-1 text-xs rounded-full bg-[#7B2D2D] text-white"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 주간 리포트 */}
      <button className="w-full py-3 rounded-lg bg-rose-200 text-sm font-medium">
        주간 리포트 보기
      </button>

      {/* 카테고리별 노트 */}
      {CATEGORIES.map((c) => (
        <section key={c}>
          <h3 className="font-semibold text-lg mb-2 flex flex-row">
            {c === "coffee"
              ? "커피 노트"
              : c === "tea"
              ? "차 노트"
              : c === "wine"
              ? "와인 노트"
              : c === "whiskey"
              ? "위스키 노트"
              : "기타 노트"}{" "}
            <span className="text-amber-500 text-sm ml-1 mt-0.25">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="black"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </h3>
          <div className="space-y-2">
            {notes[c]?.length ? (
              notes[c].slice(0, 2).map((n) => (
                <div
                  key={n.noteId}
                  className="p-3 rounded-lg bg-[#B0B0B0] flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-200">
                    <Image
                      src={n.photo}
                      alt={n.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white">{n.date}</p>
                    <p className="text-sm text-white font-semibold">{n.name}</p>
                    <Stars n={n.rating} />
                  </div>
                  <span className="text-amber-500 text-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">
                아직 작성한 노트가 없습니다.
              </p>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
