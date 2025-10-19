"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { apiSaveSettings } from "@/lib/api";

export default function SettingsPage({ userId, go }: { userId: string; go: (v: "tutorial" | "faq" | "contact") => void }) {
  const [username, setUsername] = useState("New User");
  const [pwd, setPwd] = useState("");
  const [lang, setLang] = useState("ASL");
  const [vibration, setVibration] = useState(false);
  const [practiceRem, setPracticeRem] = useState(true);
  const [featureRem, setFeatureRem] = useState(false);

  async function saveAll() {
    await apiSaveSettings(userId, { username, lang, vibration, practiceRem, featureRem });
    alert("Settings saved (mock)");
  }

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">⚙️ Settings</h1>
        <p className="text-gray-300 text-lg">Customize your learning experience</p>
      </div>

      <Section title="Profile & Account">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-300 font-medium">Username</label>
            <input className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-900/50 text-white p-2 focus:border-purple-500 outline-none transition-colors" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-300 font-medium">Change Password (min 8 chars)</label>
            <input className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-900/50 text-white p-2 focus:border-purple-500 outline-none transition-colors" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} minLength={8} placeholder="••••••••" />
          </div>
        </div>
        <button className="mt-3 rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
          Update Profile Photo
        </button>
      </Section>

      <Section title="Language">
        <div>
          <div className="text-sm text-gray-300 font-medium">Current Language</div>
          <select className="mt-2 rounded-lg border border-gray-600 bg-gray-900/50 text-white p-2 focus:border-purple-500 outline-none transition-colors" value={lang} onChange={(e)=>setLang(e.target.value)}>
            <option>ASL</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">More languages coming soon.</p>
        </div>
      </Section>

      <Section title="App Preferences">
        <Toggle label="Vibration Feedback" checked={vibration} onChange={setVibration} />
        <Soon label="Sound Effects" />
        <Soon label="High Accuracy Mode" />
        <Soon label="Autosave Translations" />
      </Section>

      <Section title="Notifications">
        <Toggle label="Practice Reminders" checked={practiceRem} onChange={setPracticeRem} />
        <Toggle label="New Feature Updates" checked={featureRem} onChange={setFeatureRem} />
      </Section>

      <Section title="Help & Support">
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>go("tutorial")} className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            Tutorial
          </button>
          <button onClick={()=>go("faq")} className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            FAQ
          </button>
          <button onClick={()=>go("contact")} className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            Report a Bug
          </button>
        </div>
      </Section>

      <Section title="Privacy & Security">
        <div className="flex flex-wrap gap-2">
          <a className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors" href="/privacy" target="_blank">
            Privacy Policy
          </a>
          <a className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors" href="/terms" target="_blank">
            Terms of Service
          </a>
          <a className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors" href="/settings/data" target="_blank">
            Data Management
          </a>
        </div>
      </Section>

      <div className="flex justify-end">
        <button onClick={saveAll} className="rounded-lg px-6 py-3 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all">
          Save Settings
        </button>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
      className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
      <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
      {children}
    </motion.section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mt-2 flex items-center justify-between rounded-lg border border-gray-600 bg-gray-900/30 p-3 cursor-pointer hover:border-purple-500 transition-colors">
      <span className="text-sm text-white">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className="rounded" />
    </label>
  );
}

function Soon({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-600 bg-gray-900/30 p-3 opacity-60">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="rounded bg-purple-500/20 px-3 py-1 text-xs text-purple-300 border border-purple-500/30">
        Coming Soon
      </span>
    </div>
  );
}
