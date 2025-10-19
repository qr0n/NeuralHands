"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Force dark mode on mount
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    // Always add dark class
    root.classList.add("dark");
  }, []);

  // Hide the toggle since we're forcing dark mode
  return null;
}
