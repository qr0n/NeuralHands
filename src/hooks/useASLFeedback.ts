/**
 * ASL Learning Mode with Corrective Feedback
 * Helps users practice ASL by providing real-time feedback
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useOfflineASL, ASLRecognitionOptions } from './useOfflineASL';
import {
  getFeedbackMessage,
  getNextTargetLetter,
  isSentenceComplete,
  calculateAccuracy,
  LetterProgress,
  PRACTICE_SENTENCES
} from '@/lib/asl-feedback';

export interface ASLFeedbackOptions extends Omit<ASLRecognitionOptions, 'onPrediction'> {
  targetSentence?: string;
  holdTimeSeconds?: number; // How long to hold sign before locking
  onSentenceComplete?: (accuracy: number) => void;
}

export interface FeedbackState {
  message: string;
  isCorrect: boolean;
}

export function useASLFeedback({
  videoRef,
  enabled = true,
  confidenceThreshold = 0.75,
  cooldownMs = 1500,
  targetSentence = PRACTICE_SENTENCES[0],
  holdTimeSeconds = 3.0,
  onSentenceComplete
}: ASLFeedbackOptions) {
  const [progress, setProgress] = useState<LetterProgress[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [previewLetter, setPreviewLetter] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [inCooldown, setInCooldown] = useState(false);

  // Use refs to avoid stale closures
  const inCooldownRef = useRef(inCooldown);
  const progressRef = useRef(progress);
  
  useEffect(() => {
    inCooldownRef.current = inCooldown;
    progressRef.current = progress;
  }, [inCooldown, progress]);

  const currentTarget = getNextTargetLetter(progress, targetSentence);
  const isComplete = isSentenceComplete(progress, targetSentence);
  const accuracy = calculateAccuracy(progress);

  // Handle predictions from offline ASL
  const handlePrediction = useCallback((prediction: any) => {
    console.log('🔍 Prediction received:', prediction.label, 'Progress count:', progressRef.current.length, 'Cooldown:', inCooldownRef.current);
    
    if (inCooldownRef.current) {
      console.log('⏸️ In cooldown, ignoring prediction');
      return;
    }
    
    const currentProgress = progressRef.current;
    const isCompleted = isSentenceComplete(currentProgress, targetSentence);
    
    if (isCompleted) {
      console.log('✅ Sentence complete, ignoring prediction');
      return;
    }

    const detectedSign = prediction.label.toUpperCase();
    
    // Ignore 'nothing' and special signs during practice
    if (detectedSign === 'NOTHING' || detectedSign === 'DEL' || detectedSign === 'SPACE') {
      setPreviewLetter(null);
      setHoldStartTime(null);
      return;
    }

    console.log('👋 Setting preview letter:', detectedSign);
    setPreviewLetter(detectedSign);

    // Generate feedback based on current target
    const target = getNextTargetLetter(currentProgress, targetSentence);
    if (target && target !== ' ') {
      const feedbackMsg = getFeedbackMessage(detectedSign, target);
      setFeedback(feedbackMsg);
      console.log('💬 Feedback:', feedbackMsg.message, '| Target:', target);
    }

    // Start hold timer only if not already started
    setHoldStartTime(prev => {
      if (prev === null) {
        console.log('⏱️ Starting hold timer for target:', target);
        return Date.now();
      }
      console.log('⏱️ Hold timer already running');
      return prev;
    });
  }, [targetSentence]);

  // Initialize offline ASL with feedback handler
  const offlineASL = useOfflineASL({
    videoRef,
    enabled,
    confidenceThreshold,
    cooldownMs: 100, // Use very short cooldown in base hook, we handle it here
    onPrediction: handlePrediction
  });

  // Progress bar update effect
  useEffect(() => {
    if (!holdStartTime || !previewLetter) {
      setHoldProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - holdStartTime) / 1000;
      const progressValue = Math.min(elapsed / holdTimeSeconds, 1);
      setHoldProgress(progressValue);

      // Lock letter when hold time is reached
      if (progressValue >= 1) {
        // Get the current target letter at the moment of locking
        setProgress(prevProgress => {
          const target = getNextTargetLetter(prevProgress, targetSentence);
          
          if (!target) {
            console.log('⚠️ No target letter found');
            return prevProgress;
          }
          
          const detectedSign = previewLetter;
          console.log('🔒 Locking letter:', target, 'Detected:', detectedSign);
          
          // Handle space in target sentence
          if (target === ' ') {
            return [...prevProgress, { letter: ' ', isCorrect: true }];
          } else {
            const isCorrect = detectedSign === target.toUpperCase();
            return [
              ...prevProgress,
              {
                letter: target,
                isCorrect,
                attemptedLetter: detectedSign
              }
            ];
          }
        });

        // Clear interval immediately
        clearInterval(interval);

        // Reset state and enter cooldown
        setPreviewLetter(null);
        setHoldStartTime(null);
        setHoldProgress(0);
        setFeedback(null);
        setInCooldown(true);
        
        console.log(`⏸️ Entering cooldown for ${cooldownMs}ms`);
        
        // Reset the underlying ASL hook's cooldown
        if (offlineASL.resetCooldown) {
          offlineASL.resetCooldown();
          console.log('🔄 Reset underlying ASL cooldown');
        }
        
        setTimeout(() => {
          console.log('▶️ Cooldown complete, ready for next letter');
          setInCooldown(false);
        }, cooldownMs);
      }
    }, 50); // Update 20 times per second

    return () => clearInterval(interval);
  }, [holdStartTime, previewLetter, targetSentence, holdTimeSeconds, cooldownMs]);

  // Check for sentence completion
  useEffect(() => {
    if (isComplete && !inCooldown) {
      onSentenceComplete?.(accuracy);
    }
  }, [isComplete, accuracy, onSentenceComplete, inCooldown]);

  // Auto-advance to next sentence
  const nextSentence = useCallback(() => {
    const nextIndex = (sentenceIndex + 1) % PRACTICE_SENTENCES.length;
    setSentenceIndex(nextIndex);
    setProgress([]);
    setFeedback(null);
    setPreviewLetter(null);
    setHoldStartTime(null);
    setHoldProgress(0);
    setInCooldown(false);
    return PRACTICE_SENTENCES[nextIndex];
  }, [sentenceIndex]);

  // Reset current sentence
  const resetSentence = useCallback(() => {
    setProgress([]);
    setFeedback(null);
    setPreviewLetter(null);
    setHoldStartTime(null);
    setHoldProgress(0);
    setInCooldown(false);
  }, []);

  // Delete last letter
  const deleteLast = useCallback(() => {
    if (progress.length > 0) {
      setProgress(prev => prev.slice(0, -1));
      setInCooldown(true);
      setTimeout(() => setInCooldown(false), cooldownMs);
    }
  }, [progress, cooldownMs]);

  return {
    // Status from offline ASL
    ...offlineASL,
    
    // Practice mode state
    targetSentence,
    progress,
    currentTarget,
    feedback,
    previewLetter,
    holdProgress,
    inCooldown,
    isComplete,
    accuracy,
    
    // Actions
    nextSentence,
    resetSentence,
    deleteLast,
    
    // Available sentences
    availableSentences: PRACTICE_SENTENCES,
    currentSentenceIndex: sentenceIndex
  };
}
