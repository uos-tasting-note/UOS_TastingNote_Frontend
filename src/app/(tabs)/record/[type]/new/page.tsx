"use client";
import { useParams, useSearchParams } from "next/navigation";
import NoteFormBase from "@/components/record/NoteFormBase";

const TYPE_MAP: Record<string, string> = {
  커피: "coffee",
  차: "tea",
  와인: "wine",
  위스키: "whiskey",
  기타: "other",
};

export default function NewNotePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawType = decodeURIComponent(params.type as string); // "커피"
  const type = TYPE_MAP[rawType]; // "coffee"
  const sub = searchParams.get("sub") || "";

  if (!type) {
    return <div className="p-6">지원하지 않는 타입: {rawType}</div>;
  }

  return <NoteFormBase sub={sub} type={type as string} />;
}
