// src/config/flavorConfig.ts

export type FlavorItem = { key: string; color: string };

export const FLAVOR_CONFIG: Record<string, FlavorItem[]> = {
  coffee: [
    { key: "신맛", color: "bg-pink-400" },
    { key: "쓴맛", color: "bg-cyan-400" },
    { key: "향미", color: "bg-green-500" },
    { key: "단맛", color: "bg-yellow-400" },
    { key: "바디", color: "bg-orange-500" },
  ],
  tea: [
    { key: "신맛", color: "bg-pink-400" },
    { key: "쓴맛", color: "bg-cyan-400" },
    { key: "단맛", color: "bg-yellow-400" },
    { key: "향미", color: "bg-green-500" },
    { key: "바디", color: "bg-orange-500" },
  ],
  wine: [
    { key: "바디", color: "bg-orange-500" },
    { key: "당도", color: "bg-yellow-400" },
    { key: "산도", color: "bg-pink-400" },
    { key: "타닌", color: "bg-green-500" },
    { key: "알코올", color: "bg-cyan-400" },
  ],
  whiskey: [
    { key: "과일", color: "bg-pink-400" },
    { key: "단맛", color: "bg-yellow-400" },
    { key: "향신료", color: "bg-orange-500" },
    { key: "허브", color: "bg-green-500" },
    { key: "곡물", color: "bg-cyan-400" },
    { key: "오크", color: "bg-purple-500" },
  ],
  other: [
    { key: "단맛", color: "bg-yellow-400" },
    { key: "쓴맛", color: "bg-cyan-400" },
    { key: "신맛", color: "bg-pink-400" },
    { key: "향미", color: "bg-green-500" },
    { key: "바디", color: "bg-orange-500" },
  ],
};
