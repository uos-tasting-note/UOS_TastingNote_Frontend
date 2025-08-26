"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "메인", icon: "home" },
  { href: "/search", label: "검색", icon: "search" },
  { href: "/record", label: "기록", icon: "note" },
  { href: "/profile", label: "프로필", icon: "user" },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <ul className="flex h-16 items-center justify-around px-2">
        {TABS.map((t) => {
          const active = pathname.includes(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={[
                  "flex flex-col items-center gap-1 text-xs",
                  active ? "text-black" : "text-gray-400",
                ].join(" ")}
              >
                <Icon name={t.icon} active={active} />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "currentColor" : "currentColor";
  switch (name) {
    case "home":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 10.5l9-7 9 7V20a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9.5z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "search":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M20 20l-3.5-3.5"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "note":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="2"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <path
            d="M8 8h8M8 12h8M8 16h5"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "user":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M4 20c1.5-3.5 4.5-5.5 8-5.5s6.5 2 8 5.5"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
