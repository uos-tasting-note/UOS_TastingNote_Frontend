"use client";
import { useRouter } from "next/navigation";

const CATEGORIES = ["커피", "차", "와인", "위스키", "기타"];

export default function CategorySelect() {
  const router = useRouter();

  const handleSelect = (cat: string) => {
    router.push(`/record/${cat}`);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">오늘의 테이스팅은?</h2>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => handleSelect(c)}
          className="w-full py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-[#7B2D2D] hover:text-white"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
