/**
 * Demo component for testing offline ASL recognition
 * Shows real-time predictions from the MLP model
 */

'use client';

import { useRef, useState } from 'react';
import { useOfflineASL } from '@/hooks/useOfflineASL';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineASLDemo() {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [sentence, setSentence] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(true);

  const {
    isReady,
    isProcessing,
    prediction,
    mediapipeError,
    supportedLabels
  } = useOfflineASL({
    videoRef,
    enabled: isEnabled,
    confidenceThreshold: 0.75,
    cooldownMs: 1500,
    onPrediction: (pred) => {
      // Build sentence from predictions
      if (pred.label === 'space') {
        setSentence(prev => prev + ' ');
      } else if (pred.label === 'del') {
        setSentence(prev => prev.slice(0, -1));
      } else if (pred.label !== 'nothing') {
        setSentence(prev => prev + pred.label);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🤟 Offline ASL Recognition
          </h1>
          <p className="text-gray-300 text-lg">
            Powered by MediaPipe + Custom MLP Model (Pure JavaScript)
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
                  onClick={() => setIsEnabled(!isEnabled)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    isEnabled
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isEnabled ? '⏸️ Pause' : '▶️ Resume'}
                </button>
                <button
                  onClick={() => setSentence('')}
                  className="px-6 py-3 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {/* Predictions & Output */}
          <div className="space-y-4">
            {/* Current Prediction */}
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Current Sign</h2>
              
              <AnimatePresence mode="wait">
                {prediction ? (
                  <motion.div
                    key={prediction.label}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="text-8xl mb-4">
                      {prediction.label === 'del' ? '⌫' :
                       prediction.label === 'space' ? '␣' :
                       prediction.label === 'nothing' ? '🙌' :
                       prediction.label}
                    </div>
                    <p className="text-white text-2xl font-bold mb-2">
                      {prediction.label.toUpperCase()}
                    </p>
                    <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                      />
                    </div>
                    <p className="text-gray-300 text-sm mt-2">
                      {(prediction.confidence * 100).toFixed(1)}% confident
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-400"
                  >
                    <p className="text-4xl mb-2">👋</p>
                    <p>Show a sign to get started</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sentence Output */}
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Output Sentence</h2>
              <div className="bg-black/30 rounded-xl p-4 min-h-[120px] border border-gray-700">
                <p className="text-white text-2xl font-mono break-words">
                  {sentence || <span className="text-gray-500">Your sentence will appear here...</span>}
                </p>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Model Info</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-green-400">
                    {isReady ? 'Ready' : 'Loading...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-semibold">MLP (3 layers)</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-semibold">~527 KB</span>
                </div>
                <div className="flex justify-between">
                  <span>Classes:</span>
                  <span className="font-semibold">{supportedLabels.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="font-semibold text-purple-400">100% Offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Signs */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Supported Signs</h2>
          <div className="flex flex-wrap gap-2">
            {supportedLabels.map((label) => (
              <span
                key={label}
                className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
