"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function AppHeader({
  onGoTranslator,
  onGoDashboard, // present only when inside the app; enables Home behavior
}: {
  onGoTranslator?: () => void;
  onGoDashboard?: () => void;
}) {
  const allowHome = typeof onGoDashboard === "function";

  return (
    <header className="sticky top-2 z-40 mx-auto w-full max-w-5xl">
      <div className="rounded-2xl border bg-white/60 px-4 py-2 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-white/40 dark:bg-black/40">
        <nav className="flex items-center justify-between">
          {/* ---------- Left: Logo + App Name ---------- */}
          <motion.button
            whileTap={allowHome ? { scale: 0.98 } : {}}
            onClick={() => allowHome && onGoDashboard?.()}
            className={`flex items-center gap-2 text-lg font-semibold ${
              allowHome ? "cursor-pointer" : "cursor-default"
            }`}
            title={allowHome ? "Home" : "Logo"}
            aria-label={allowHome ? "Go to Home" : "App logo"}
            role="button"
            tabIndex={allowHome ? 0 : -1}
          >
            {/* Logo with optional tweaks: circular, 40x40, hover scale */}
            <motion.div
              whileHover={allowHome ? { scale: 1.05 } : {}}
              className={`relative inline-flex items-center justify-center ${
                allowHome ? "hover:shadow-[0_0_0_4px_rgba(124,58,237,0.15)]" : ""
              } rounded-full`}
              style={{ lineHeight: 0 }}
            >
              <Image
                src="/logo.png"          // place your logo at /public/logo.png
                alt="Neural Hand logo"
                width={40}                // 👈 size tweak
                height={40}               // 👈 size tweak
                className="rounded-full"  // 👈 circular tweak
                priority
              />
            </motion.div>

            Neural Hand
          </motion.button>

          {/* ---------- Right: Quick access + Theme ---------- */}
          <div className="flex items-center gap-2 text-sm">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onGoTranslator?.()}
              className="rounded-md px-3 py-1.5 text-sm"
              style={{ background: "var(--primary-700)", color: "white" }}
            >
              Translator (no sign-in)
            </motion.button>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
