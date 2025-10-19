"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactSupportPage({ back }: { back?: () => void }) {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [desc, setDesc] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    alert("Submitted (mock)");
  }

  return (
    <motion.form initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
      onSubmit={submit} className="space-y-4 card-surface rounded-2xl p-6 pb-24 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contact Support</h3>
        {back && (
          <button onClick={back} type="button" className="rounded-md px-3 py-1.5 text-sm outline-btn hover:bg-white/40 dark:hover:bg-white/10">
            Back
          </button>
        )}
      </div>

      <div>
        <label className="text-xs">Email</label>
        <input className="mt-1 w-full rounded-lg border bg-transparent p-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="text-xs">Topic</label>
        <input className="mt-1 w-full rounded-lg border bg-transparent p-2" value={topic} onChange={(e)=>setTopic(e.target.value)} required />
      </div>
      <div>
        <label className="text-xs">Description</label>
        <textarea className="mt-1 w-full rounded-lg border bg-transparent p-2" rows={5} value={desc} onChange={(e)=>setDesc(e.target.value)} />
      </div>
      <motion.button whileTap={{scale:.98}} className="rounded-lg px-4 py-2 text-sm text-white" style={{background:"var(--primary-700)"}}>
        Send
      </motion.button>
    </motion.form>
  );
}
