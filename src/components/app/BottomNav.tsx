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
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-5xl border-t border-gray-700 bg-gray-800/90 p-2 backdrop-blur shadow-2xl">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = current === it.key;
          return (
            <li key={it.key} className="flex justify-center">
              <button
                onClick={() => setCurrent(it.key)}
                className={`flex w-full flex-col items-center rounded-xl px-2 py-2 transition-all duration-150 ${
                  active 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105" 
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-xl">{it.icon}</span>
                <span className="text-[11px] font-medium">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
