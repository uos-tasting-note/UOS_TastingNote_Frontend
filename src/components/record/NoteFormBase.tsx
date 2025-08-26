"use client";
import { useState } from "react";
import FlavorRadar from "./FlavorRadar";
import FlavorSelector from "./FlavorSelector";
import RatingStars from "./RatingStars";
import { FLAVOR_CONFIG } from "@/config/flavorConfig";
import { NOTE_CONFIG } from "@/config/noteConfig";
import { apiFetch } from "@/utils/api";

export default function NoteFormBase({
  sub,
  type,
}: {
  sub: string;
  type: keyof typeof NOTE_CONFIG;
}) {
  // 공통 상태
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [values, setValuesState] = useState<Record<string, any>>({});
  const setValues = (k: string, v: any) =>
    setValuesState((prev) => ({ ...prev, [k]: v }));

  const [flavors, setFlavors] = useState(
    Object.fromEntries(FLAVOR_CONFIG[type].map(({ key }) => [key, 0]))
  );
  const updateFlavor = (k: string, v: number) =>
    setFlavors((prev) => ({ ...prev, [k]: v }));

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const flavorArray = Object.entries(flavors).map(([name, value]) => ({
    name,
    value,
  }));

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("내용을 입력해주세요");
      return;
    }

    try {
      // 1) 라벨 먼저 요청
      const labelRes = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes/labels`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: type, // coffee / tea / wine / whiskey / other
            content, // 사용자가 입력한 노트 내용
          }),
        }
      );

      if (!labelRes?.ok) {
        console.error("❌ 라벨 생성 실패", await labelRes?.text());
        return;
      }

      const labelJson = await labelRes.json();
      const labelId = labelJson.data.labelId;
      console.log("✅ 라벨 생성 완료:", labelJson);

      // 2) 노트 생성 요청
      const formData = new FormData();
      if (file) formData.append("file", file);

      // const meta = {
      //   category: type,
      //   categoryStyle: sub,
      //   rating,
      //   content,
      //   labelId, // ✅ 라벨 아이디 포함
      //   tags: flavorArray,
      //   date,
      //   ...values,
      // };
      console.log("values", values);
      const meta = {
        category: type,
        categoryStyle: sub,
        degree: values.degree || "",
        name: values.name || "",
        rating,
        content,
        labelId, // ✅ 라벨 아이디 포함
        tags: flavorArray,
        date,
      };
      formData.append(
        "meta",
        new Blob([JSON.stringify(meta)], { type: "application/json" })
      );

      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        }
      );

      if (res?.ok) {
        console.log("✅ 노트 생성 완료:", await res?.json());
      } else {
        console.error("❌ 노트 생성 실패", await res?.text());
      }
    } catch (err) {
      console.error("🚨 요청 중 오류 발생", err);
    }
  };

  return (
    <div className="w-full max-w-screen h-full p-5 space-y-6">
      {/* 사진 업로드 */}
      <div className="flex flex-col items-center">
        <label
          className="w-40 h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ backgroundColor: "#5B5B5B" }}
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="object-cover w-full h-full"
            />
          ) : (
            // ✅ 카메라 아이콘 (SVG)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="white"
              className="w-13 h-13"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
              />
            </svg>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      {/* 기본 정보 */}
      <div>
        <h3 className="font-semibold mb-2 ml-5">기본 정보</h3>
        <div
          className="space-y-2 rounded-xl pt-1.5 pb-0.5 px-5"
          style={{ backgroundColor: "#5B5B5B" }}
        >
          <div className=" py-1 w-full flex flex-row text-lg border-b border-gray-400">
            <h4 className="w-15 text-gray-100">제목</h4>
            <input
              type="text"
              placeholder="제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-right rounded text-gray-100 focus:outline-none focus:ring-0"
            />
          </div>
          <div className=" w-full flex flex-row text-lg border-b border-gray-400 pb-1">
            <h4 className="w-15 text-gray-100">날짜</h4>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-55 ml-auto rounded pl-30 text-gray-100 focus:outline-none focus:ring-0
             [&::-webkit-calendar-picker-indicator]:opacity-0 
             [&::-webkit-calendar-picker-indicator]:absolute 
             [&::-webkit-calendar-picker-indicator]:w-32
             [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
          {/* 종류 (subCategory, 읽기 전용) */}
          <div className=" w-full flex flex-row text-lg pb-1">
            <h4 className="w-15 text-gray-100">종류</h4>
            <div className="rounded text-orange-400 ml-auto">{sub}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 ml-5">기본 정보</h3>
        <div
          className="space-y-2 rounded-xl pt-1.5 pb-0.5 px-5"
          style={{ backgroundColor: "#5B5B5B" }}
        >
          {/* 음료별 필드 (NOTE_CONFIG 기반) */}
          <div className="space-y-1">
            {NOTE_CONFIG[type].map((f) =>
              f.type === "text" ? (
                <div
                  key={f.key}
                  className=" py-1 w-full flex flex-row text-lg border-b border-gray-400"
                >
                  <h4 className="w-45 text-gray-100">{f.placeholder}</h4>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={values[f.key] || ""}
                    onChange={(e) => setValues(f.key, e.target.value)}
                    className=" w-full text-right rounded text-gray-100 focus:outline-none focus:ring-0"
                  />
                </div>
              ) : (
                <div key={f.key} className="w-full flex flex-row text-lg pb-1">
                  <h4 className="w-45 py-1 text-gray-100">{f.placeholder}</h4>
                  <select
                    value={values[f.key] || ""}
                    onChange={(e) => setValues(f.key, e.target.value)}
                    className="w-full rounded text-right text-gray-100 p-1.5 focus:outline-none focus:ring-0"
                  >
                    <option
                      value=""
                      className="text-gray-100"
                      style={{ backgroundColor: "#5B5B5B" }}
                    >
                      {f.placeholder}
                    </option>
                    {f.options.map((opt) => (
                      <option
                        key={opt}
                        value={opt}
                        className="text-gray-100"
                        style={{ backgroundColor: "#5B5B5B" }}
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 미각 */}
      <div>
        <h3 className="font-semibold mb-2">미각</h3>
        <div className="flex items-center gap-4 p-3 rounded-xl bg-[#5B5B5B]">
          <FlavorRadar data={flavorArray} />
          <div className="flex flex-col space-y-2 flex-1">
            {FLAVOR_CONFIG[type].map(({ key, color }) => (
              <FlavorSelector
                key={key}
                label={key}
                value={flavors[key]}
                onChange={(v) => updateFlavor(key, v)}
                color={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 추가 노트 */}
      <div>
        <h3 className="font-semibold mb-2 ml-5">추가 노트</h3>
        <textarea
          placeholder="더 추가하고 싶은 내용을 입력해주세요"
          value={content}
          maxLength={100}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-35 rounded-xl bg-[#5B5B5B] border py-3 px-4 text-gray-100 focus:outline-none focus:ring-0"
        />
      </div>
      {/* 평점 */}
      <RatingStars value={rating} setValue={setRating} />

      {/* 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-[#7B2D2D] text-white rounded-lg"
      >
        기록 남기기
      </button>
    </div>
  );
}
