/**
 * ASL Practice Mode Page with Corrective Feedback
 * Helps users learn ASL by providing real-time feedback on their signs
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { useASLFeedback } from '@/hooks/useASLFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { practiceAnalytics, PracticeSession } from '@/lib/practice-analytics';
import Link from 'next/link';

export default function ASLPracticePage() {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [sessionStartTime] = useState(() => Date.now());

  const {
    isReady,
    isProcessing,
    mediapipeError,
    targetSentence,
    progress,
    currentTarget,
    feedback,
    previewLetter,
    holdProgress,
    inCooldown,
    isComplete,
    accuracy,
    nextSentence,
    resetSentence,
    deleteLast
  } = useASLFeedback({
    videoRef,
    enabled: true,
    confidenceThreshold: 0.75,
    cooldownMs: 1500,
    holdTimeSeconds: 3.0,
    onSentenceComplete: (acc) => {
      console.log(`🎉 Sentence complete! Accuracy: ${acc.toFixed(1)}%`);
      
      // Save completed session to analytics
      const duration = Math.round((Date.now() - sessionStartTime) / 1000);
      const session: PracticeSession = {
        id: sessionId,
        timestamp: sessionStartTime,
        targetSentence,
        progress: progress,
        accuracy: acc,
        duration,
        completedAt: Date.now()
      };
      
      practiceAnalytics.savePracticeSession(session);
      console.log('✅ Session saved to analytics');
    }
  });

  // Save incomplete session when leaving page
  useEffect(() => {
    return () => {
      if (progress.length > 0 && !isComplete) {
        const duration = Math.round((Date.now() - sessionStartTime) / 1000);
        const session: PracticeSession = {
          id: sessionId,
          timestamp: sessionStartTime,
          targetSentence,
          progress: progress,
          accuracy,
          duration
        };
        practiceAnalytics.savePracticeSession(session);
      }
    };
  }, [sessionId, sessionStartTime, targetSentence, progress, accuracy, isComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium shadow-lg"
            >
              ← Back
            </motion.button>
          </Link>
          
          <Link href="/analytics">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-lg"
            >
              📊 View Analytics
            </motion.button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎓 ASL Practice Mode
          </h1>
          <p className="text-gray-300 text-lg">
            Learn ASL with Real-time Corrective Feedback
          </p>
          
          {/* Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur">
            <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-white text-sm font-medium">
              {isReady ? '✅ Ready - 100% Offline' : '⏳ Loading model...'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Feed */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Processing Indicator */}
                {isProcessing && (
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    Processing...
                  </div>
                )}

                {/* Cooldown Indicator */}
                {inCooldown && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ⏸️ Cooldown
                  </div>
                )}

                {/* Error Display */}
                {mediapipeError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 backdrop-blur">
                    <div className="text-white text-center p-6">
                      <p className="text-xl font-bold mb-2">❌ Error</p>
                      <p className="text-sm">{mediapipeError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-4 flex gap-4">
                <button
                  onClick={resetSentence}
                  disabled={progress.length === 0}
                  className="flex-1 py-3 rounded-xl font-semibold bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={deleteLast}
                  disabled={progress.length === 0}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ⌫ Delete Last
                </button>
                {isComplete && (
                  <button
                    onClick={nextSentence}
                    className="flex-1 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white transition-all"
                  >
                    ➡️ Next Sentence
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Practice Info & Feedback */}
          <div className="space-y-4">
            {/* Target Sentence */}
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Target Sentence</h2>
              <p className="text-4xl font-bold text-center py-6 tracking-wide text-white">
                {targetSentence}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">
                  Progress: {progress.length}/{targetSentence.length}
                </span>
                <span className={`font-bold ${
                  accuracy >= 80 ? 'text-green-400' :
                  accuracy >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {accuracy.toFixed(0)}% Accurate
                </span>
              </div>
            </div>

            {/* Current Target */}
            {currentTarget && !isComplete && (
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">
                  {currentTarget === ' ' ? 'Space Required' : 'Make This Sign'}
                </h2>
                
                <div className="text-center py-8">
                  <div className="text-9xl font-bold mb-4">
                    {currentTarget === ' ' ? '␣' : currentTarget}
                  </div>
                  
                  {previewLetter && (
                    <div className="mt-6">
                      <p className="text-gray-300 text-sm mb-2">
                        Detected: <span className="font-bold text-white">{previewLetter}</span>
                      </p>
                      <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                        <motion.div
                          animate={{ width: `${holdProgress * 100}%` }}
                          className={`h-full ${
                            feedback?.isCorrect
                              ? 'bg-gradient-to-r from-green-500 to-green-400'
                              : 'bg-gradient-to-r from-red-500 to-red-400'
                          }`}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        Hold for {((1 - holdProgress) * 3).toFixed(1)}s to lock
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback Message */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback.message}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className={`rounded-2xl p-6 shadow-2xl ${
                    feedback.isCorrect
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-red-500/20 border-2 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {feedback.isCorrect ? '✅' : '❌'}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg mb-2 ${
                        feedback.isCorrect ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {feedback.isCorrect ? 'Perfect!' : 'Try Again'}
                      </h3>
                      <p className="text-white">{feedback.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Display */}
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Your Progress</h2>
              <div className="bg-black/30 rounded-xl p-4 min-h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {progress.map((p, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-2xl font-mono px-2 py-1 rounded ${
                        p.isCorrect
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                      title={p.isCorrect ? 'Correct!' : `You signed: ${p.attemptedLetter}`}
                    >
                      {p.letter}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Completion Message */}
            {isComplete && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 shadow-2xl text-center text-white"
              >
                <p className="text-6xl mb-4">🎉</p>
                <h2 className="text-3xl font-bold mb-2">Sentence Complete!</h2>
                <p className="text-2xl font-semibold mb-4">
                  Final Accuracy: {accuracy.toFixed(1)}%
                </p>
                <p className="text-lg opacity-90">
                  {accuracy >= 90 ? 'Outstanding! You\'re a natural!' :
                   accuracy >= 75 ? 'Great job! Keep practicing!' :
                   accuracy >= 60 ? 'Good effort! Try again for better accuracy!' :
                   'Keep practicing! You\'ll get better!'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
