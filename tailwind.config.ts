// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",         // ← string, not ["class"]
  theme: { extend: {} },     // v4: no content globs
  plugins: [],               // add plugins later if you need
};

export default config;
