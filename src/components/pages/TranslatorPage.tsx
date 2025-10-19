"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCameras } from "@/hooks/useCameras";
import CameraFeed from "@/components/media/CameraFeed";
import GeminiFeedbackDisplay from "@/components/media/GeminiFeedbackDisplay";
import Link from "next/link";

interface GeminiFeedback {
  signs_detected: Array<{
    sign: string;
    sequence_position: string;
    feedback: string | {
      what_they_did_well?: string;
      improvements_needed?: string;
    };
  }>;
  detailed_feedback: string;
  summary: string;
}

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
  const [tts, setTts] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [output, setOutput] = useState("");
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Cloud (Gemini) specific state
  const [isRecording, setIsRecording] = useState(false); // Tracks if actively capturing frames
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]); // Stores base64 frames
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Shows loading during backend call
  const [geminiFeedback, setGeminiFeedback] = useState<GeminiFeedback | null>(null); // Gemini response
  const [showSummary, setShowSummary] = useState(false); // Toggle detailed/summary view
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null); // Frame capture interval

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

  // Capture frame from video for Gemini analysis
  // Wrapped in useCallback to prevent recreation on every render
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, []); // Empty deps - only depends on ref which doesn't change

  // Start/Stop recording for Gemini analysis
  // Wrapped in useCallback to maintain stable reference
  const toggleRecording = useCallback(async () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setCapturedFrames([]);
      setGeminiFeedback(null);
      setOutput("Recording... Perform your sign!");

      // Capture frames at ~3 FPS
      captureIntervalRef.current = setInterval(() => {
        const frame = captureFrame();
        if (frame) {
          setCapturedFrames((prev) => {
            const updated = [...prev, frame];
            setOutput(`Recording... (${updated.length} frames captured)`);
            return updated;
          });
        }
      }, 333);
    } else {
      // Stop recording and analyze
      setIsRecording(false);
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }

      if (capturedFrames.length < 3) {
        setOutput("Too few frames captured. Please try again.");
        return;
      }

      setIsAnalyzing(true);
      setOutput("Your signing is being analyzed by Gemini...");

      try {
        const response = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frames: capturedFrames }),
        });

        const data = await response.json();

        if (data.error) {
          setOutput(`Error: ${data.error}`);
          setIsAnalyzing(false);
          return;
        }

        setGeminiFeedback(data);
        setOutput("Analysis complete! See feedback below.");
        setShowSummary(false);
      } catch (error: any) {
        setOutput(`Network error: ${error.message}. Make sure backend is running on port 8000.`);
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, [isRecording, capturedFrames, captureFrame]); // Only re-create when these change

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, []);

  // Called each frame by CameraFeed
  // Wrapped in useCallback to prevent camera re-initialization
  const onFrame = useCallback(() => {
    // No-op for cloud mode - frames captured manually via toggleRecording
  }, []);

  // Memoize the video ref attachment callback to prevent re-renders
  const attachVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Top bar: guest banner + Back to Start + Offline Link */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-between gap-3 mb-6"
        >
          {guestMode ? (
            <div className="rounded-xl border border-purple-300 bg-purple-50 px-3 py-2 text-sm text-purple-900 dark:border-purple-500/40 dark:bg-purple-500/15 dark:text-purple-100">
              Guest mode: sign in to save progress and unlock richer practice.
            </div>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Link href="/offline">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg"
              >
                🔒 Offline Mode
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoAuth}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium shadow-lg"
            >
              Back to Start
            </motion.button>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">☁️ Cloud Mode (Google AI)</h1>
          <p className="text-gray-300 text-lg">Powered by Gemini 2.5 Pro for advanced sign analysis</p>
          <p className="text-gray-400 text-sm mt-2">Internet connection required</p>
        </motion.div>

      {/* Camera Controls */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15 }}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl mb-6"
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Camera Selector */}
          {devices.length > 1 && (
            <select
              value={selectedId || ""}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-gray-700 text-white border border-gray-600"
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          )}

          {/* Overlay Toggle */}
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={overlay}
              onChange={(e) => setOverlay(e.target.checked)}
              className="rounded"
            />
            <span>Show Hand Overlay</span>
          </label>

          {/* TTS Toggle */}
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={tts}
              onChange={(e) => setTts(e.target.checked)}
              className="rounded"
            />
            <span>Text-to-Speech</span>
          </label>
        </div>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl mb-6"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {/* Start Camera Button - Nice gradient style */}
          <motion.button
            whileTap={{ scale: active ? 0.98 : 1 }}
            onClick={() => setActive((v) => !v)}
            className="rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            {active ? "Stop Camera" : "Start Camera"}
          </motion.button>

          {/* Cloud-specific controls */}
          <div className="ml-auto flex gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={toggleRecording}
              disabled={isAnalyzing}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                isRecording
                  ? "animate-pulse bg-gradient-to-r from-pink-500 to-yellow-400 text-white"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isRecording ? "Stop & Analyze" : "Toggle Live Feedback"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSummary((v) => !v)}
              disabled={!geminiFeedback}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-blue-600 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showSummary ? "Show Detailed" : "Show Summary"}
            </motion.button>
          </div>
        </div>

        {/* Camera */}
        {active && (
          <CameraFeed
            deviceId={selectedId}
            onFrame={onFrame}
            showOverlay={overlay}
            landmarks={landmarks}
            _attachVideoRef={attachVideoRef}
          />
        )}

        {/* Output */}
        <div className="mt-4 rounded-xl border border-gray-600 bg-gray-900/50 p-3 text-sm text-white">
          {isAnalyzing ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
              <span>{output}</span>
            </div>
          ) : (
            <span>{output || "Output will appear here…"}</span>
          )}
        </div>
      </motion.div>

      {/* Gemini Feedback Display */}
      <AnimatePresence>
        {geminiFeedback && (
          <GeminiFeedbackDisplay
            feedback={geminiFeedback}
            showSummary={showSummary}
          />
        )}
      </AnimatePresence>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.25 }}
        className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
      >
        <p className="mb-2 text-white">
          ☁️ <strong>Cloud Mode</strong> uses Google Gemini AI for advanced sign recognition and personalized feedback.
        </p>
        <p className="text-sm text-gray-400">
          Need offline access? Try <Link href="/offline" className="underline text-green-400 hover:text-green-300">Offline Mode</Link> instead.
        </p>
      </motion.div>
      </div>
    </div>
  );
}