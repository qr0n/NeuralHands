/**
 * Complete offline ASL recognition hook
 * Combines MediaPipe hand tracking with MLP model inference
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import useMediaPipe, { HandLandmarks } from './useMediaPipe';
import { getMLPModel, extractLandmarkFeatures, PredictionResult } from '@/lib/mlp-model';

export interface ASLRecognitionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
  confidenceThreshold?: number;
  cooldownMs?: number; // Prevent duplicate predictions
  onPrediction?: (prediction: PredictionResult) => void;
}

export function useOfflineASL({
  videoRef,
  enabled = true,
  confidenceThreshold = 0.7,
  cooldownMs = 1000,
  onPrediction
}: ASLRecognitionOptions) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mlpModel = useRef(getMLPModel());
  const lastPredictionTime = useRef<number>(0);
  const lastPredictedLabel = useRef<string | null>(null);

  // Load MLP model weights
  useEffect(() => {
    mlpModel.current.loadWeights()
      .then(() => {
        setModelLoaded(true);
        console.log('✅ Offline ASL model ready');
      })
      .catch((error) => {
        console.error('❌ Failed to load ASL model:', error);
      });
  }, []);

  // Handle hand detection results
  const handleHandDetection = useCallback((handData: HandLandmarks | null) => {
    if (!enabled || !modelLoaded || !handData) {
      setCurrentPrediction(null);
      return;
    }

    // Check cooldown to prevent spam
    const now = Date.now();
    if (now - lastPredictionTime.current < cooldownMs) {
      return;
    }

    try {
      setIsProcessing(true);

      // Extract normalized features (63 values)
      const features = extractLandmarkFeatures(
        handData.landmarks,
        handData.handedness
      );

      // Run inference
      const prediction = mlpModel.current.predict(features);

      // Only report predictions above confidence threshold
      if (prediction.confidence >= confidenceThreshold) {
        // Prevent duplicate predictions
        if (prediction.label !== lastPredictedLabel.current) {
          setCurrentPrediction(prediction);
          onPrediction?.(prediction);
          
          lastPredictedLabel.current = prediction.label;
          lastPredictionTime.current = now;
          
          console.log(`🤟 Predicted: ${prediction.label} (${(prediction.confidence * 100).toFixed(1)}%)`);
        }
      } else {
        setCurrentPrediction(null);
      }
    } catch (error) {
      console.error('❌ Prediction error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [enabled, modelLoaded, confidenceThreshold, cooldownMs, onPrediction]);

  // Initialize MediaPipe
  const mediapipe = useMediaPipe(videoRef, {
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
    onResults: handleHandDetection
  });

  // Reset cooldown when prediction changes
  const resetCooldown = useCallback(() => {
    lastPredictionTime.current = 0;
    lastPredictedLabel.current = null;
  }, []);

  return {
    // Status
    isReady: modelLoaded && mediapipe.isReady,
    isProcessing,
    
    // Current prediction
    prediction: currentPrediction,
    
    // Methods
    resetCooldown,
    
    // MediaPipe status
    mediapipeError: mediapipe.error,
    
    // Model info
    supportedLabels: mlpModel.current.getLabels()
  };
}
