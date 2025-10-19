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
      <div className="rounded-2xl border border-gray-700 bg-gray-800/80 px-4 py-2 backdrop-blur shadow-2xl">
        <nav className="flex items-center justify-between">
          {/* ---------- Left: Logo + App Name ---------- */}
          <motion.button
            whileTap={allowHome ? { scale: 0.98 } : {}}
            onClick={() => allowHome && onGoDashboard?.()}
            className={`flex items-center gap-2 text-lg font-semibold text-white ${
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
                allowHome ? "hover:shadow-[0_0_0_4px_rgba(168,85,247,0.3)]" : ""
              } rounded-full`}
              style={{ lineHeight: 0 }}
            >
              <Image
                src="/logo.png"
                alt="Neural Hand logo"
                width={40}
                height={40}
                className="rounded-full"
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
              className="rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
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
