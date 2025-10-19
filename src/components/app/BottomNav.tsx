"use client";
import { MainView } from "./types";

const items: Array<{ key: MainView; label: string; icon: string }> = [
  { key: "home",       label: "Home",       icon: "🏠" },
  { key: "translator", label: "Translator", icon: "📖" },
  { key: "dashboard",  label: "Dashboard",  icon: "📊" },
  { key: "settings",   label: "Settings",   icon: "⚙️" },
  { key: "about",      label: "About",      icon: "ℹ️" },
];

export default function BottomNav({
  current,
  setCurrent,
}: { current: MainView; setCurrent: (v: MainView) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-5xl border-t bg-white/80 p-2 backdrop-blur dark:bg-black/60">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = current === it.key;
          return (
            <li key={it.key} className="flex justify-center">
              <button
                onClick={() => setCurrent(it.key)}
                className={`flex w-full flex-col items-center rounded-xl px-2 py-1 transition-transform duration-150 ${active ? "scale-105 text-black dark:text-white" : "text-gray-500 hover:scale-105 dark:text-gray-300"}`}
              >
                <span className="text-lg">{it.icon}</span>
                <span className="text-[12px]">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
