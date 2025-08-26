"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Note = {
  noteId: number;
  name: string;
  content: string;
  rating: number;
  photo: string;
  date: string; // "YYYY-MM-DD"
  likes: number;
};

type SortOption = "latest" | "oldest" | "likes" | "ratingLow" | "ratingHigh";

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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<Note[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [showSortOptions, setShowSortOptions] = useState(false);
  // 🔎 오토컴플리트
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const fetchSuggest = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search/suggest-name/${query}`
        );
        if (!res.ok) return;
        const json = await res.json();
        setSuggestions(json.data.names || []);
      } catch (err) {
        console.error(err);
      }
    };
    const debounce = setTimeout(fetchSuggest, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  // 🚀 검색 실행
  const handleSearch = async (q: string) => {
    if (!q) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search/notes/${q}`
      );
      if (!res.ok) throw new Error("검색 실패");
      const json = await res.json();
      setResults(json.data || []);
      setShowSuggestions(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 정렬
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "likes":
        return b.likes - a.likes;
      case "ratingLow":
        return a.rating - b.rating;
      case "ratingHigh":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-xl mx-auto py-6 px-6 space-y-4">
      <h1 className="text-2xl font-bold">노트 검색</h1>

      {/* 검색창 */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(query);
          }}
          placeholder="ex. 에티오피아 원두"
          className="w-full bg-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-0"
        />

        {/* 자동완성 드롭다운 */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white rounded-lg mt-1 shadow z-10">
            {suggestions.map((s) => (
              <li
                key={s}
                onClick={() => {
                  setQuery(s);
                  handleSearch(s);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 정렬 버튼 */}

      <div className="flex flex-row w-full">
        {showSortOptions && (
          <div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <button
                onClick={() => setSortBy("latest")}
                className={`px-4.5 py-1.25 rounded-full text-md font-bold ${
                  sortBy === "latest"
                    ? "bg-[#853238] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                최신 순
              </button>
              <button
                onClick={() => setSortBy("oldest")}
                className={`px-4.5 py-1.25 rounded-full text-md font-bold ${
                  sortBy === "oldest"
                    ? "bg-[#853238] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                오래된 순
              </button>
              <button
                onClick={() => setSortBy("likes")}
                className={`px-4.5 py-1.25 rounded-full text-md font-bold ${
                  sortBy === "likes"
                    ? "bg-[#853238] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                좋아요 순
              </button>
              <button
                onClick={() => setSortBy("ratingLow")}
                className={`px-4.5 py-1.25 rounded-full text-md font-bold ${
                  sortBy === "ratingLow"
                    ? "bg-[#853238] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                평점 낮은 순
              </button>
              <button
                onClick={() => setSortBy("ratingHigh")}
                className={`px-4.5 py-1.25 rounded-full text-md font-bold ${
                  sortBy === "ratingHigh"
                    ? "bg-[#853238] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                평점 높은 순
              </button>
            </div>
          </div>
        )}
        <button
          className="w-5 h-5 ml-auto flex items-center justify-center rounded-full bg-white border border-black"
          onClick={() => setShowSortOptions((prev) => !prev)}
          aria-label="정렬 옵션 열기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 32"
            stroke="black"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 15l6 6 6-6"
            />
          </svg>
        </button>
      </div>

      {/* 검색 결과 */}
      <div className="space-y-4">
        {sortedResults.length > 0
          ? sortedResults.map((n) => (
              <div
                key={n.noteId}
                className="bg-white border rounded-lg p-4 flex gap-3"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={n.photo || "/images/placeholder.png"}
                    alt={n.name || "노트 이미지"}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{n.date}</div>
                  <div className="font-semibold">{n.name}</div>
                  <div className="text-sm truncate">{n.content}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <Stars n={n.rating} />
                    <span className="text-xs text-gray-500">❤️ {n.likes}</span>
                  </div>
                </div>
              </div>
            ))
          : query && (
              <p className="text-sm text-gray-400 mt-4">
                검색 결과가 없습니다.
              </p>
            )}
      </div>
    </div>
  );
}
