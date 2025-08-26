"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Note = {
  noteId: number;
  name: string;
  rating: number;
  photo: string;
  date: string;
};

export default function MyNotes({ notes }: { notes: Record<string, Note[]> }) {
  const router = useRouter();
  const engToKor: Record<string, string> = {
    coffee: "커피",
    tea: "차",
    wine: "와인",
    whiskey: "위스키",
    other: "기타",
  };

  function onNoteClick(n: Note) {
    router.push(`/note/${n.noteId}`);
  }

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
  return (
    <div className="space-y-6">
      <button className="w-full py-3 rounded-lg bg-rose-200 text-sm font-medium">
        주간 리포트 보기
      </button>
      {Object.entries(notes).map(([category, list]) => (
        <section key={category}>
          <h3 className="font-semibold text-xl mb-2 flex flex-row">
            {engToKor[category]} 노트
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="black"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h3>

          <div className="space-y-2">
            {list?.length ? (
              list.slice(0, 3).map((n) => (
                <div
                  key={n.noteId}
                  className="p-3 rounded-lg bg-[#B0B0B0] flex items-center gap-3"
                  onClick={() => onNoteClick(n)}
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200">
                    <Image
                      src={n.photo}
                      alt={n.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-100">{n.date}</p>
                    <p className="text-lg font-semibold text-gray-100">
                      {n.name}
                    </p>
                    <Stars n={n.rating} />
                  </div>
                  <span className="text-amber-500 text-sm">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
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
    </div>
  );
}
