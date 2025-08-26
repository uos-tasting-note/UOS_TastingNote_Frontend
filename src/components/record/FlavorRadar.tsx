"use client";
import {
  Radar,
  RadarChart,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { name: string; value: number }[];
};

export default function FlavorRadar({ data }: Props) {
  // 차트 중심 좌표와 반경을 직접 지정
  const cx = 70;
  const cy = 77;
  const outerRadius = 74; // 꼭지점 반경
  const labelOffset = 15; // 꼭지점에서 안쪽으로 당기는 거리

  const points = data
    .map((_, index) => {
      const angle = ((360 / data.length) * index - 90) * (Math.PI / 180);
      const x = cx + outerRadius * Math.cos(angle);
      const y = cy + outerRadius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div className="w-40 h-38">
      <ResponsiveContainer>
        <RadarChart cx={cx} cy={cy} outerRadius={outerRadius} data={data}>
          <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
          <polygon points={points} fill="#313131" />

          <Radar
            name="미각"
            dataKey="value"
            stroke="#DE7676"
            fill="#DE7676"
            fillOpacity={1}
            isAnimationActive={false}
          />
          {/* ✅ 꼭지점 근처 라벨 */}
          {data.map((entry, index) => {
            const angle = ((360 / data.length) * index - 90) * (Math.PI / 180); // 라디안
            const r = outerRadius - labelOffset;
            const x = cx + r * Math.cos(angle) * 0.9;
            const y = cy + r * Math.sin(angle) * 0.9;
            return (
              <text
                key={`label-${entry.name}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={250}
                fill="white"
              >
                {entry.name}
              </text>
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
