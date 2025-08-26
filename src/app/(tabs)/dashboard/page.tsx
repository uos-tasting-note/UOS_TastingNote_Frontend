import Image from "next/image";

type Note = {
  noteId: number;
  name: string;
  content: string;
  rating: number; // 0~5
  photo: string;
  date: string; // "YYYY-MM-DD"
  likes: number;
};

async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/api/notes`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("failed to load notes");
  const json = await res.json();
  return Array.isArray(json?.data) ? (json.data as Note[]) : [];
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(d);
  } catch {
    return iso;
  }
}

function Stars({ n }: { n: number }) {
  const arr = Array.from({ length: 5 }, (_, i) => i < n);
  return (
    <div className="flex items-center gap-0.5">
      {arr.map((on, i) => (
        <svg
          key={i}
          width="20"
          height="20"
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const notes = await fetchNotes();
  console.log("노트들:", notes);

  return (
    <main className="mx-auto max-w-md px-4 py-3">
      {/* 상단 탭(추천/최근) UI 뼈대 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-6 text-sm">
          <span className="font-semibold">추천</span>
          <span className="text-gray-400">최근</span>
        </div>
        <button aria-label="정렬" className="text-gray-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6-6 6 6M6 15l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 카드 리스트 */}
      <ul className="space-y-4">
        {notes.map((n) => (
          <li key={n.noteId} className=" bg-white border-b border-gray-200">
            <div className="p-4">
              {/* 작성자/시간 (예시) */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="flex flex-row items-center gap-2">
                    <div className="text-sm font-semibold">익명</div>
                    <div className="text-[11px] text-gray-400">
                      {(Math.random() * 23 + 1).toFixed(0)}시간 전
                    </div>
                  </div>
                  <div className="mt-1 text-md font-medium text-gray-700">
                    {n.content}
                  </div>
                </div>
                <button className="text-gray-400" aria-label="more">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </div>

              {/* 이미지 */}
              <div className="ml-11.5 w-50 mt-3 overflow-hidden rounded-2xl">
                <Image
                  src={n.photo}
                  alt={n.name}
                  width={450}
                  height={450}
                  className="w-50 h-auto"
                />
              </div>

              {/* 내용 */}
              <div className="mt-3">
                <div className="text-[11px] text-gray-400">{n.date}</div>
                <div className="text-sm font-semibold">{n.name}</div>
                <div className="flex flex-row">
                  <div className="mt-2 flex items-center gap-2">
                    <Stars n={n.rating} />
                  </div>
                  <div className="flex items-center gap-4 text-[15px] ml-auto">
                    <button
                      className="flex items-center gap-1 text-rose-500"
                      aria-label="like"
                    >
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12.1 8.64l-.1.1-.1-.1C10.14 6.7 7.1 7.24 6 9.28c-1.04 1.96.02 4.36 2.3 5.74L12 18l3.7-2.98c2.28-1.38 3.34-3.78 2.3-5.74-1.1-2.04-4.14-2.58-5.9-.64z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                      {n.likes}
                    </button>
                    <button className="text-gray-500" aria-label="comment">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-500" aria-label="share">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 8l-4-4-4 4M12 4v12"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
