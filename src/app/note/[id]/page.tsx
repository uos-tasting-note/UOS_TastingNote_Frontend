import FlavorRadar from "@/components/record/FlavorRadar";
import { FLAVOR_CONFIG } from "@/config/flavorConfig";
import Image from "next/image";

type NoteDetail = {
  name: string;
  degree: string;
  category: string;
  categoryStyle: string;
  photo: string;
  rating: number;
  content: string;
  tags: { name: string; value: number }[];
  label: string;
  date: string;
  likes: number;
  bookmarks: number;
};

async function getNoteDetail(id: string): Promise<NoteDetail> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes/note/${id}`
  );

  if (!res.ok) throw new Error("Failed to fetch note detail");
  const json = await res.json();
  return json.data;
}

export default async function NoteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const note = await getNoteDetail(params.id);

  function Stars({ n }: { n: number }) {
    const arr = Array.from({ length: 5 }, (_, i) => i < n);
    return (
      <div className="flex items-center gap-0.5">
        {arr.map((on, i) => (
          <svg
            key={i}
            width="30"
            height="30"
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
    <div className="max-w-2xl mx-auto px-5.5 py-6 flex flex-col items-center bg-gray-200">
      <div className="flex flex-col items-center">
        <label
          className="w-50 h-50 rounded-3xl flex items-center justify-center overflow-hidden mb-3"
          style={{ backgroundColor: "#5B5B5B" }}
        >
          <Image
            src={note.photo}
            alt={note.name}
            width={250}
            height={250}
            className="object-cover rounded-xl w-full h-full"
          />
        </label>
      </div>
      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-2">{note.name}</h1>
      {/* 날짜 */}
      <p className="text-xs text-gray-400 mb-2">{note.date}</p>
      {/* 카테고리, 스타일, 로스팅 정도 */}
      <p className="text-sm text-gray-500 mb-2">
        {note.category} · {note.categoryStyle} · {note.degree}
      </p>
      {/* 평점 */}
      <div className="flex items-center mb-4">
        <Stars n={note.rating} />
      </div>
      {/* 내용 */}
      <p className="mb-3 w-full h-35 rounded-xl bg-[#5B5B5B] border py-3 px-4 text-gray-100">
        {note.content}
      </p>
      <div className="flex items-center gap-4 p-3 rounded-xl bg-[#5B5B5B]">
        <div className="flex flex-row flex-1">
          <FlavorRadar data={note.tags} />

          <div className="flex flex-col space-y-2 flex-1">
            {FLAVOR_CONFIG[note.category].map(({ key, color }) => {
              const tag = note.tags.find((t) => t.name === key);
              const value = tag ? tag.value : 0;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between w-46 border-b border-gray-200 pr-2 py-0.5 -mt-1 [&:last-child]:border-0 [&:last-child]:-mb-1"
                >
                  {/* 키 라벨 */}
                  <span className="w-24 text-center text-gray-100 font-medium">
                    {key}
                  </span>

                  {/* 값 */}
                  <span className="w-8 text-gray-300 font-medium mr-1">
                    {value.toFixed(1)}
                  </span>

                  {/* 동그라미 점수 (읽기 전용) */}
                  <div className="flex space-x-1 pointer-events-none">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${
                          i <= value ? color : "bg-gray-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* 좋아요 / 북마크 */}
      <div className="flex items-center gap-4 text-[25px] mt-5 mb-6">
        <button
          className="flex items-center gap-1 text-rose-500"
          aria-label="like"
        >
          <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
            <path
              d="M12.1 8.64l-.1.1-.1-.1C10.14 6.7 7.1 7.24 6 9.28c-1.04 1.96.02 4.36 2.3 5.74L12 18l3.7-2.98c2.28-1.38 3.34-3.78 2.3-5.74-1.1-2.04-4.14-2.58-5.9-.64z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          {note.likes}
        </button>
        <button className="text-gray-500" aria-label="comment">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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
  );
}
