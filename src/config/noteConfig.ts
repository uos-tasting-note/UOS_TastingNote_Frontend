// src/config/noteConfig.ts

export type Field =
  | { type: "text"; key: string; placeholder: string }
  | { type: "select"; key: string; placeholder: string; options: string[] };

export const NOTE_CONFIG: Record<string, Field[]> = {
  coffee: [
    { type: "text", key: "name", placeholder: "원두 이름" },
    {
      type: "select",
      key: "degree",
      placeholder: "로스팅 정도",
      options: [
        "light",
        "cinnamon",
        "medium",
        "high",
        "city",
        "fullcity",
        "french",
        "italian",
      ],
    },
  ],
  tea: [
    { type: "text", key: "name", placeholder: "원산지/브랜드" },
    { type: "text", key: "degree", placeholder: "우린 시간" },
  ],
  wine: [
    { type: "text", key: "name", placeholder: "포도 품종" },
    { type: "text", key: "degree", placeholder: "년도" },
  ],
  whiskey: [{ type: "text", key: "abv", placeholder: "도수" }],
  other: [
    { type: "text", key: "name", placeholder: "종류 입력" },
    { type: "text", key: "degree", placeholder: "도수" },
  ],
};
