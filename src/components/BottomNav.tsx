"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Schedule", icon: CalendarDays },
    { href: "/favorites", label: "My Events", icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink-200/30 bg-white/80 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors ${
                isActive
                  ? "text-pink-600"
                  : "text-stone-400 active:text-pink-400"
              }`}
            >
              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                fill={isActive && tab.href === "/favorites" ? "currentColor" : "none"}
              />
              <span className="text-[10px] font-semibold tracking-wide uppercase">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
