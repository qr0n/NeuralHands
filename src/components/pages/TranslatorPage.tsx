"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCameras } from "@/hooks/useCameras";
import CameraFeed from "@/components/media/CameraFeed";
import CameraToolbar from "@/components/media/CameraToolbar";

type ModelKey = "local" | "cloud";

interface TranslatorPageProps {
  guestMode?: boolean;
  onGoAuth?: () => void; // allows returning to Login/Sign Up
}

export default function TranslatorPage({
  guestMode = false,
  onGoAuth,
}: TranslatorPageProps) {
  const { devices, selectedId, setSelectedId } = useCameras();
  const [active, setActive] = useState(false);
  const [model, setModel] = useState<ModelKey>("local");
  const [tts, setTts] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [output, setOutput] = useState("");
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Web Speech API for TTS
  const synth = useMemo(
    () => (typeof window !== "undefined" ? window.speechSynthesis : null),
    []
  );
  useEffect(() => {
    if (tts && output && synth) {
      const u = new SpeechSynthesisUtterance(output);
      synth.cancel();
      synth.speak(u);
    }
  }, [output, tts, synth]);

  // Called each frame by CameraFeed (wire ML later)
  const onFrame = () => {
    // TODO: Step 4 — run local/cloud pipeline and update:
    // setLandmarks(/* ... */);
    // setOutput(/* ... */);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top bar: guest banner + Back to Start */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between gap-3"
      >
        {guestMode ? (
          <div className="rounded-xl border border-purple-300 bg-purple-50 px-3 py-2 text-sm text-purple-900 dark:border-purple-500/40 dark:bg-purple-500/15 dark:text-purple-100">
            Guest mode: sign in to save progress and unlock richer practice.
          </div>
        ) : (
          <div />
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onGoAuth}
          className="rounded-md px-3 py-1.5 text-sm outline-btn hover:bg-white/40 dark:hover:bg-white/10"
        >
          Back to Start
        </motion.button>
      </motion.div>

      {/* Toolbar: camera switch, model switch, overlay + TTS */}
      <CameraToolbar
        devices={devices}
        selectedId={selectedId}
        onSelect={setSelectedId}
        detectionOn={overlay}
        setDetectionOn={setOverlay}
        model={model}
        setModel={setModel}
        tts={tts}
        setTts={setTts}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card-surface rounded-2xl p-6 shadow"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <motion.button
            whileTap={{ scale: active ? 0.98 : 1 }}
            onClick={() => setActive((v) => !v)}
            className="rounded-xl px-4 py-2 text-sm"
            style={{ background: "var(--primary-700)", color: "white" }}
          >
            {active ? "Stop Camera" : "Start Camera"}
          </motion.button>

        <span className="ml-2 text-xs opacity-70">
            Using: <b>{model === "local" ? "Local (offline)" : "Cloud (Google AI)"}</b>
          </span>
        </div>

        {/* Camera */}
        <CameraFeed
          deviceId={selectedId}
          onFrame={onFrame}
          showOverlay={overlay}
          landmarks={landmarks}
          _attachVideoRef={(el) => (videoRef.current = el)}
        />

        {/* Output */}
        <textarea
          className="mt-4 w-full rounded-xl border bg-transparent p-3 text-sm"
          placeholder="Output will appear here…"
          rows={4}
          value={output}
          onChange={(e) => setOutput(e.target.value)}
        />
      </motion.div>

      {model === "cloud" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="card-surface rounded-xl p-4 text-sm"
        >
          Practice and sentence-building use the Cloud model. Accuracy improves
          with feedback.
        </motion.div>
      )}
    </div>
  );
}