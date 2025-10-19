"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useOfflineASL } from "@/hooks/useOfflineASL";
import { getFeedbackMessage, ASL_FEEDBACK } from "@/lib/asl-feedback";
import { practiceAnalytics, PracticeSession } from "@/lib/practice-analytics";
import type { PredictionResult } from "@/lib/mlp-model";

interface LocalFeedbackModeProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  targetText?: string; // Optional target text to type
}

interface FeedbackState {
  message: string;
  isCorrect: boolean;
  detectedLetter: string;
  targetLetter: string;
}

export default function LocalFeedbackMode({
  videoRef,
  enabled,
  targetText,
}: LocalFeedbackModeProps) {
  const router = useRouter();
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackState | null>(null);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
  const [inCooldown, setInCooldown] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [sessionStartTime] = useState(() => Date.now());
  
  const holdTimeSeconds = 2.5; // Time to hold before committing
  const cooldownMs = 1000;

  // Use refs to avoid stale closures
  const inCooldownRef = useRef(inCooldown);
  const translatedTextRef = useRef(translatedText);
  
  useEffect(() => {
    inCooldownRef.current = inCooldown;
    translatedTextRef.current = translatedText;
  }, [inCooldown, translatedText]);

  // Handle predictions from offline ASL model
  const handlePrediction = useCallback((prediction: PredictionResult) => {
    console.log('🔍 Prediction received:', prediction.label, 'Confidence:', prediction.confidence, 'Cooldown:', inCooldownRef.current);
    
    if (inCooldownRef.current) {
      console.log('⏸️ In cooldown, ignoring prediction');
      return;
    }

    const label = prediction.label.toUpperCase();
    
    // Ignore 'nothing' detections
    if (label === "NOTHING") {
      setDetectedSign(null);
      setConfidence(0);
      setHoldStartTime(null);
      setCurrentFeedback(null);
      return;
    }

    // Handle special commands
    if (label === "DEL") {
      if (translatedTextRef.current.length > 0) {
        setTranslatedText((prev) => prev.slice(0, -1));
        setInCooldown(true);
        setTimeout(() => {
          console.log('▶️ DEL cooldown complete');
          setInCooldown(false);
        }, cooldownMs);
      }
      return;
    }

    if (label === "SPACE") {
      setTranslatedText((prev) => prev + " ");
      setInCooldown(true);
      setTimeout(() => {
        console.log('▶️ SPACE cooldown complete');
        setInCooldown(false);
      }, cooldownMs);
      return;
    }

    console.log('👋 Setting detected sign:', label);
    setDetectedSign(label);
    setConfidence(prediction.confidence);

    // Generate feedback for the detected letter
    if (ASL_FEEDBACK[label]) {
      // Check if we have a target text
      if (targetText) {
        const currentIndex = translatedTextRef.current.length;
        const targetLetter = targetText[currentIndex]?.toUpperCase();
        
        if (targetLetter) {
          const feedbackMsg = getFeedbackMessage(label, targetLetter);
          setCurrentFeedback({
            message: feedbackMsg.message,
            isCorrect: feedbackMsg.isCorrect,
            detectedLetter: label,
            targetLetter: targetLetter,
          });
          console.log('💬 Feedback:', feedbackMsg.message, '| Target:', targetLetter);
        }
      } else {
        // For free-form mode, always show positive feedback
        setCurrentFeedback({
          message: ASL_FEEDBACK[label].correct,
          isCorrect: true,
          detectedLetter: label,
          targetLetter: label,
        });
      }
    }

    // Start hold timer
    setHoldStartTime((prev) => {
      if (prev === null) {
        console.log('⏱️ Starting hold timer');
        return Date.now();
      }
      console.log('⏱️ Hold timer already running');
      return prev;
    });
  }, [cooldownMs, targetText]);

  // Initialize offline ASL recognition
  const { isReady, isProcessing, mediapipeError } = useOfflineASL({
    videoRef,
    enabled,
    confidenceThreshold: 0.7,
    cooldownMs: 100, // Very short internal cooldown, we handle longer cooldown here
    onPrediction: handlePrediction,
  });

  // Check for target text completion
  const isComplete = targetText ? translatedText === targetText.toUpperCase() : false;
  const accuracy = targetText && translatedText.length > 0
    ? (translatedText.split('').filter((char, idx) => char === targetText[idx]?.toUpperCase()).length / targetText.length) * 100
    : 100;

  // Handle completion and navigation to analytics
  useEffect(() => {
    if (isComplete && targetText) {
      const duration = Math.round((Date.now() - sessionStartTime) / 1000);
      const session: PracticeSession = {
        id: sessionId,
        timestamp: sessionStartTime,
        targetSentence: targetText,
        progress: translatedText.split('').map((char, idx) => ({
          letter: targetText[idx],
          isCorrect: char === targetText[idx]?.toUpperCase(),
          attemptedLetter: char
        })),
        accuracy,
        duration,
        completedAt: Date.now()
      };
      
      practiceAnalytics.savePracticeSession(session);
      console.log('✅ Session saved to analytics, navigating...');
      
      // Navigate to analytics after a short delay
      setTimeout(() => {
        router.push('/analytics');
      }, 2000);
    }
  }, [isComplete, targetText, translatedText, accuracy, sessionId, sessionStartTime, router]);

  // Save incomplete session when leaving page
  useEffect(() => {
    return () => {
      if (translatedText.length > 0 && !isComplete && targetText) {
        const duration = Math.round((Date.now() - sessionStartTime) / 1000);
        const session: PracticeSession = {
          id: sessionId,
          timestamp: sessionStartTime,
          targetSentence: targetText,
          progress: translatedText.split('').map((char, idx) => ({
            letter: targetText[idx],
            isCorrect: char === targetText[idx]?.toUpperCase(),
            attemptedLetter: char
          })),
          accuracy,
          duration
        };
        practiceAnalytics.savePracticeSession(session);
      }
    };
  }, [sessionId, sessionStartTime, targetText, translatedText, accuracy, isComplete]);

  // Progress bar update effect
  useEffect(() => {
    if (!holdStartTime || !detectedSign) {
      setHoldProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - holdStartTime) / 1000;
      const progressValue = Math.min(elapsed / holdTimeSeconds, 1);
      setHoldProgress(progressValue);

      // Commit letter when hold time is reached
      if (progressValue >= 1) {
        console.log('🔒 Locking letter:', detectedSign);
        setTranslatedText((prev) => prev + detectedSign);
        
        // Clear interval and reset state
        clearInterval(interval);
        setDetectedSign(null);
        setHoldStartTime(null);
        setHoldProgress(0);
        setConfidence(0);
        
        // Brief cooldown
        setInCooldown(true);
        console.log(`⏸️ Entering cooldown for ${cooldownMs}ms`);
        setTimeout(() => {
          console.log('▶️ Cooldown complete, ready for next letter');
          setInCooldown(false);
          setCurrentFeedback(null);
        }, cooldownMs);
      }
    }, 50); // Update 20 times per second

    return () => clearInterval(interval);
  }, [holdStartTime, detectedSign, holdTimeSeconds, cooldownMs]);

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-2 backdrop-blur">
          <div
            className={`h-3 w-3 rounded-full ${
              isReady ? "bg-green-500 animate-pulse" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm font-medium">
            {isReady ? "✅ Ready - 100% Offline" : "⏳ Loading model..."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {inCooldown && (
            <div className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
              ⏸️ Cooldown
            </div>
          )}
          
          {targetText && (
            <div className="text-sm text-gray-400">
              Target: <span className="font-bold text-white">{targetText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Detection */}
      {detectedSign && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold">{detectedSign}</div>
              <div className="text-sm opacity-70">
                <div>
                  Confidence:{" "}
                  <span className="font-semibold">
                    {(confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1 text-xs">
                  Hold for {((1 - holdProgress) * holdTimeSeconds).toFixed(1)}s
                </div>
              </div>
            </div>

            {/* Hold Progress */}
            <div className="relative h-16 w-16">
              <svg className="h-full w-full -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="opacity-20"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 28 * (1 - holdProgress)
                  }`}
                  className="text-green-500 transition-all"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {Math.round(holdProgress * 100)}%
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instant Feedback */}
      <AnimatePresence mode="wait">
        {currentFeedback && detectedSign && (
          <motion.div
            key={currentFeedback.message}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`rounded-xl border-2 p-4 ${
              currentFeedback.isCorrect
                ? "border-green-500 bg-green-500/10"
                : "border-red-500 bg-red-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {currentFeedback.isCorrect ? "✅" : "❌"}
              </div>
              <div>
                <h4
                  className={`mb-1 font-bold ${
                    currentFeedback.isCorrect
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {currentFeedback.isCorrect ? "Great Sign!" : "Try Again"}
                </h4>
                <p className="text-sm opacity-90">{currentFeedback.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Translated Text Output */}
      <div className="card-surface rounded-xl p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold opacity-70">Translated Text</h3>
          <div className="flex items-center gap-2">
            {targetText && (
              <span className={`text-xs font-bold ${
                accuracy >= 80 ? 'text-green-400' :
                accuracy >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {accuracy.toFixed(0)}% Accurate
              </span>
            )}
            {translatedText && (
              <button
                onClick={() => setTranslatedText("")}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="min-h-[60px] rounded-lg bg-black/20 p-3 font-mono text-lg">
          {translatedText || (
            <span className="opacity-50">
              {targetText ? `Type: ${targetText}` : "Start signing to see text here..."}
            </span>
          )}
        </div>
        
        {/* Progress Bar for Target Text */}
        {targetText && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress: {translatedText.length}/{targetText.length}</span>
            </div>
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                animate={{ width: `${(translatedText.length / targetText.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Completion Message */}
      {isComplete && targetText && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 shadow-2xl text-center text-white"
        >
          <p className="text-4xl mb-3">🎉</p>
          <h2 className="text-2xl font-bold mb-2">Complete!</h2>
          <p className="text-xl font-semibold mb-2">
            Accuracy: {accuracy.toFixed(1)}%
          </p>
          <p className="text-sm opacity-90">
            Navigating to analytics in 2 seconds...
          </p>
        </motion.div>
      )}

      {/* Helpful Tips */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-xs">
        <div className="font-semibold">💡 Tips:</div>
        <ul className="ml-4 mt-1 list-disc space-y-1 opacity-80">
          <li>Hold each sign steady for {holdTimeSeconds} seconds to commit</li>
          <li>Sign "DEL" to delete the last character</li>
          <li>Sign "SPACE" to add a space</li>
          <li>Green feedback means correct sign detection</li>
        </ul>
      </div>

      {/* Error Display */}
      {mediapipeError && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
          <span className="font-semibold">Error:</span> {mediapipeError}
        </div>
      )}
    </div>
  );
}
