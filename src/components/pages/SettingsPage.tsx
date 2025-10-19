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
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6 pb-28">
      <Section title="Profile & Account">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs">Username</label>
            <input className="mt-1 w-full rounded-lg border bg-transparent p-2" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <div>
            <label className="text-xs">Change Password (min 8 chars)</label>
            <input className="mt-1 w-full rounded-lg border bg-transparent p-2" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} minLength={8} />
          </div>
        </div>
        <button className="mt-3 rounded-lg border px-3 py-1.5 text-sm hover:bg-white/40 dark:hover:bg-white/10">Update Profile Photo</button>
      </Section>

      <Section title="Language">
        <div>
          <div className="text-sm">Current Language</div>
          <select className="mt-2 rounded-lg border bg-transparent p-2" value={lang} onChange={(e)=>setLang(e.target.value)}>
            <option>ASL</option>
          </select>
          <p className="mt-1 text-xs opacity-70">More languages coming soon.</p>
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
          <button onClick={()=>go("tutorial")} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-white/40 dark:hover:bg-white/10">Tutorial</button>
          <button onClick={()=>go("faq")} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-white/40 dark:hover:bg-white/10">FAQ</button>
          <button onClick={()=>go("contact")} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-white/40 dark:hover:bg-white/10">Report a Bug</button>
        </div>
      </Section>

      <Section title="Privacy & Security">
        <div className="flex flex-wrap gap-2">
          <a className="rounded-lg border px-3 py-1.5 text-sm hover:bg-white/40 dark:hover:bg-white/10" href="#" target="_blank">Privacy Policy</a>
          <a className="rounded-lg border px-3 py-1.5 text-sm hover:bg-white/40 dark:hover:bg-white/10" href="#" target="_blank">Terms of Service</a>
          <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-white/40 dark:hover:bg-white/10">Data Management</button>
        </div>
      </Section>

      <div className="sticky bottom-20 flex justify-end">
        <button onClick={saveAll} className="rounded-lg px-4 py-2 text-sm text-white" style={{background:"var(--primary-700)"}}>
          Save Settings
        </button>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
      className="card-surface rounded-2xl p-5 shadow">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      {children}
    </motion.section>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mt-2 flex items-center justify-between rounded-lg border p-3">
      <span className="text-sm">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} />
    </label>
  );
}
function Soon({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center justify-between rounded-lg border p-3 opacity-70">
      <span className="text-sm">{label}</span>
      <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">Coming Soon</span>
    </div>
  );
}
