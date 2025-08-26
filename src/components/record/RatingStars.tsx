"use client";
type Props = { value: number; setValue: (v: number) => void };

export default function RatingStars({ value, setValue }: Props) {
  return (
    <div
      className="flex space-x-1 p-2 pl-4 pr-5 rounded-xl justify-center items-center"
      style={{ backgroundColor: "#5B5B5B" }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setValue(star)}
          className={`${
            star <= value ? "text-yellow-400" : "text-gray-100"
          } text-3xl`}
        >
          ★
        </button>
      ))}
      <span className="ml-auto text-gray-100 text-2xl">{value}</span>
    </div>
  );
}
