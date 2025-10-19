"use client";

import { motion } from "framer-motion";
import type { CameraDevice } from "@/hooks/useCameras";

export default function CameraToolbar({
  devices,
  selectedId,
  onSelect,
  detectionOn,
  setDetectionOn,
  model,
  setModel,
  tts,
  setTts,
}: {
  devices: CameraDevice[];
  selectedId?: string;
  onSelect: (id: string) => void;
  detectionOn: boolean;
  setDetectionOn: (v: boolean) => void;
  model: "local" | "cloud";
  setModel: (m: "local" | "cloud") => void;
  tts: boolean;
  setTts: (v: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface rounded-2xl p-4"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70">Camera</span>
          <select
            className="w-full rounded-md border bg-transparent p-2 text-sm"
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs opacity-70">Model</span>
          <select
            className="rounded-md border bg-transparent p-2 text-sm"
            value={model}
            onChange={(e) => setModel(e.target.value as "local" | "cloud")}
          >
            <option value="local">Local (offline)</option>
            <option value="cloud">Cloud (Google AI)</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={detectionOn} onChange={(e)=>setDetectionOn(e.target.checked)} />
            Overlay
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={tts} onChange={(e)=>setTts(e.target.checked)} />
            Speak
          </label>
        </div>
      </div>
    </motion.div>
  );
}
