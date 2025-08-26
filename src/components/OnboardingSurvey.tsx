"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

type Step = { q: string; options: string[] };

const STEPS: Step[] = [
  {
    q: "Q1. 어떤 음료를 가장 자주 즐기시나요?",
    options: ["커피", "차", "위스키", "와인", "기타"],
  }, // 1~5
  {
    q: "Q2. 선호하는 맛의 성향은 무엇인가요?",
    options: [
      "달콤하고 부드러운 맛",
      "산뜻하고 상큼한 맛",
      "진하고 묵직한 맛",
      "씁쓸하고 드라이한 맛",
      "향이 강렬하고 개성 있는 맛",
    ],
  }, // 6~10
  {
    q: "Q3. 평소 즐기는 농도/강도는 어떤 편인가요?",
    options: [
      "연하고 가벼운 스타일",
      "중간 정도의 균형 잡힌 스타일",
      "진하고 강한 스타일",
    ],
  }, // 11~13
  {
    q: "Q4. 어떤 상황에서 음료를 주로 즐기시나요?",
    options: [
      "아침 시작할 때",
      "식사와 함께",
      "휴식/독서/작업 시간에",
      "모임/파티/친구와 함께",
      "특별한 날이나 기념일에",
    ],
  }, // 14~18
];

export default function OnboardingSurvey() {
  const router = useRouter();
  const { form, file } = useOnboarding();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(STEPS.length).fill(-1)
  );
  const current = STEPS[step];
  const selected = answers[step];
  const isLast = step === STEPS.length - 1;

  const select = (idx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = idx;
      return next;
    });
  };

  const finish = async () => {
    if (!form) {
      console.error("Onboarding form data is missing.");
      router.replace("/login");
      return;
    }

    // tagIds 매핑
    const tagIds: number[] = [];
    let offset = 0;
    STEPS.forEach((s, i) => {
      const answerIdx = answers[i];
      if (answerIdx >= 0) tagIds.push(offset + answerIdx + 1);
      offset += s.options.length;
    });

    const registerData = {
      ...form,
      tagIds,
    };

    const formData = new FormData();
    formData.append(
      "registerData",
      new Blob([JSON.stringify(registerData)], { type: "application/json" })
    );
    if (file) formData.append("profileImage", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "회원가입 실패");

      localStorage.setItem("access_token", json.data.accessToken);
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      router.replace("/login?error=register_failed");
    }
  };

  const next = () => {
    if (selected < 0) return;
    if (!isLast) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="rounded-3xl bg-white border shadow-sm p-6">
          <h2 className="text-lg font-semibold">{current.q}</h2>
          <div className="mt-5 space-y-3">
            {current.options.map((opt, idx) => {
              const active = idx === selected;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => select(idx)}
                  className={`w-full text-left rounded-2xl px-4 py-3 text-sm border transition ${
                    active
                      ? "bg-[#7B2D2D] text-white"
                      : "bg-gray-200/80 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-6 flex justify-center">
        <button
          type="button"
          onClick={next}
          disabled={selected < 0}
          className="w-12 h-12 rounded-full border flex items-center justify-center bg-white shadow disabled:opacity-40"
        >
          {isLast ? "✔" : "→"}
        </button>
      </div>
    </div>
  );
}
