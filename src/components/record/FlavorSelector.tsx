"use client";
type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
};

export default function FlavorSelector({
  label,
  value,
  onChange,
  color,
}: Props) {
  return (
    <div className="flex items-center justify-between w-46 border-b border-gray-200 pr-2 py-0.5 -mt-1 [&:last-child]:border-0 [&:last-child]:-mb-1">
      <span className="w-24 text-center text-gray-100 font-medium">
        {label}
      </span>
      <span className="w-8  text-gray-300 font-medium mr-1">
        {value.toFixed(1)}
      </span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`w-4 h-4 rounded-full ${
              i <= value ? color : "bg-gray-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
