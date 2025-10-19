"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCameras } from "@/hooks/useCameras";
import CameraFeed from "@/components/media/CameraFeed";
import LocalFeedbackMode from "@/components/media/LocalFeedbackMode";
import Link from "next/link";

export default function OfflinePage() {
  const { devices, selectedId, setSelectedId } = useCameras();
  const [active, setActive] = useState(false);
  const [targetText, setTargetText] = useState("");
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const attachVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium shadow-lg"
            >
              ← Back to Home
            </motion.button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔒 Offline ASL Mode
          </h1>
          <p className="text-gray-300 text-lg">
            100% Offline - No Internet Required
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Uses MediaPipe + Local MLP Model for instant sign recognition
          </p>
        </div>

        {/* Controls Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl mb-6"
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Camera Button */}
            <motion.button
              whileTap={{ scale: active ? 0.98 : 1 }}
              onClick={() => setActive((v) => !v)}
              className="rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              {active ? "Stop Camera" : "Start Camera"}
            </motion.button>

            {/* Camera Selector */}
            {devices.length > 1 && (
              <select
                value={selectedId || ""}
                onChange={(e) => setSelectedId(e.target.value)}
                className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600"
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            )}

            {/* Overlay Toggle */}
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={showOverlay}
                onChange={(e) => setShowOverlay(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Hand Overlay</span>
            </label>

            {/* Target Text Input */}
            <div className="ml-auto flex items-center gap-2">
              <label className="text-white text-sm">Target:</label>
              <input
                type="text"
                placeholder="Optional target text..."
                value={targetText}
                onChange={(e) => setTargetText(e.target.value.toUpperCase())}
                className="rounded-lg px-3 py-2 text-sm bg-gray-700 text-white border border-gray-600 focus:border-purple-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Camera Feed */}
          {active && (
            <CameraFeed
              deviceId={selectedId}
              showOverlay={showOverlay}
              landmarks={null}
              _attachVideoRef={attachVideoRef}
            />
          )}
        </motion.div>

        {/* Feedback Mode */}
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl"
          >
            <LocalFeedbackMode
              videoRef={videoRef}
              enabled={active}
              targetText={targetText || undefined}
            />
          </motion.div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="text-green-400 font-bold mb-1">100% Offline</h3>
            <p className="text-gray-300 text-sm">
              Works without internet. All processing happens locally in your browser.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-blue-400 font-bold mb-1">Real-time Feedback</h3>
            <p className="text-gray-300 text-sm">
              Instant sign detection with hold-to-confirm mechanism.
            </p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-purple-400 font-bold mb-1">Practice Mode</h3>
            <p className="text-gray-300 text-sm">
              Set a target text and track your accuracy as you sign.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gray-800/30 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-white font-bold text-lg mb-3">📖 How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Click "Start Camera" to begin</li>
            <li>Perform ASL signs in front of the camera</li>
            <li>Hold each sign steady for 2.5 seconds to lock it in</li>
            <li>Optional: Enter a target text to practice typing specific words</li>
            <li>Use DEL to remove the last character, SPACE to add a space</li>
            <li>View your translated text and accuracy in real-time</li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
