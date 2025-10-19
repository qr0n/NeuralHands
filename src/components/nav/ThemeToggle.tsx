"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="rounded-md px-3 py-1.5 text-sm outline-btn hover:bg-white/40 dark:hover:bg-white/10"
      title="Toggle theme"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
