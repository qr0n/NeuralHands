/**
 * React hook for MediaPipe Hands integration (CDN version)
 * Provides real-time hand tracking in the browser
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// MediaPipe is loaded from CDN - global types
declare global {
  interface Window {
    Hands: any;
    Camera: any;
    HAND_CONNECTIONS: any;
  }
}

export interface HandLandmarks {
  landmarks: any[];
  handedness: string; // 'Left' or 'Right'
}

export interface UseMediaPipeOptions {
  maxNumHands?: number;
  modelComplexity?: 0 | 1;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
  onResults?: (results: HandLandmarks | null) => void;
}

export function useMediaPipe(videoRef: React.RefObject<HTMLVideoElement>, options: UseMediaPipeOptions = {}) {
  const {
    maxNumHands = 1,
    modelComplexity = 1,
    minDetectionConfidence = 0.5,
    minTrackingConfidence = 0.5,
    onResults
  } = options;

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  /**
   * Process MediaPipe results and extract hand landmarks
   */
  const handleResults = useCallback((results: any) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Get the first detected hand
      const handedness = results.multiHandedness?.[0]?.label || 'Unknown';
      
      const handData: HandLandmarks = {
        landmarks: results.multiHandLandmarks[0],
        handedness
      };

      onResults?.(handData);
    } else {
      onResults?.(null);
    }
  }, [onResults]);

  /**
   * Initialize MediaPipe Hands
   */
  useEffect(() => {
    if (!videoRef.current) return;

    let hands: any = null;
    let camera: any = null;
    let isCleanedUp = false;

    // Wait for MediaPipe to load from CDN
    const initMediaPipe = () => {
      if (isCleanedUp) return false;
      if (typeof window === 'undefined' || !window.Hands || !window.Camera) {
        return false;
      }

      try {
        // Close existing instances first
        if (handsRef.current) {
          try {
            handsRef.current.close();
          } catch (e) {
            console.warn('Error closing previous hands instance:', e);
          }
          handsRef.current = null;
        }
        if (cameraRef.current) {
          try {
            cameraRef.current.stop();
          } catch (e) {
            console.warn('Error stopping previous camera:', e);
          }
          cameraRef.current = null;
        }

        hands = new window.Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands,
          modelComplexity,
          minDetectionConfidence,
          minTrackingConfidence,
        });

        hands.onResults(handleResults);
        handsRef.current = hands;

        // Initialize camera
        const video = videoRef.current;
        if (!video || isCleanedUp) {
          if (hands) hands.close();
          return false;
        }

        // Stop any existing video playback to prevent interruption errors
        try {
          video.pause();
          video.srcObject = null;
        } catch (e) {
          // Ignore if video wasn't playing
        }

        camera = new window.Camera(video, {
          onFrame: async () => {
            if (!isCleanedUp && hands && video.readyState >= 2) {
              try {
                await hands.send({ image: video });
              } catch (e) {
                // Ignore errors from deleted objects or interrupted operations
                const errorMsg = e instanceof Error ? e.message : String(e);
                if (!errorMsg.includes('deleted') && !errorMsg.includes('interrupted')) {
                  console.error('MediaPipe send error:', e);
                }
              }
            }
          },
          width: 1280,
          height: 720
        });

        cameraRef.current = camera;
        
        if (!isCleanedUp) {
          // Start camera with error handling
          try {
            camera.start();
            setIsReady(true);
          } catch (e) {
            console.error('Camera start error:', e);
            setError('Failed to start camera');
            return false;
          }
        }

        return true;
      } catch (err) {
        console.error('MediaPipe initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize MediaPipe');
        return false;
      }
    };

    // Try to initialize immediately
    if (!initMediaPipe()) {
      // If not ready, poll until MediaPipe loads
      const checkInterval = setInterval(() => {
        if (isCleanedUp) {
          clearInterval(checkInterval);
          return;
        }
        if (initMediaPipe()) {
          clearInterval(checkInterval);
        }
      }, 100);

      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        if (!isCleanedUp) {
          setError('MediaPipe failed to load from CDN');
        }
      }, 10000);

      return () => {
        isCleanedUp = true;
        clearInterval(checkInterval);
        clearTimeout(timeout);
        
        if (camera) {
          try {
            camera.stop();
          } catch (e) {
            console.warn('Error stopping camera on cleanup:', e);
          }
        }
        if (hands) {
          try {
            hands.close();
          } catch (e) {
            console.warn('Error closing hands on cleanup:', e);
          }
        }
        
        // Stop video playback
        if (videoRef.current) {
          try {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
          } catch (e) {
            // Ignore
          }
        }
        
        handsRef.current = null;
        cameraRef.current = null;
        setIsReady(false);
      };
    }

    return () => {
      isCleanedUp = true;
      
      if (camera) {
        try {
          camera.stop();
        } catch (e) {
          console.warn('Error stopping camera on cleanup:', e);
        }
      }
      if (hands) {
        try {
          hands.close();
        } catch (e) {
          console.warn('Error closing hands on cleanup:', e);
        }
      }
      
      // Stop video playback
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
        } catch (e) {
          // Ignore
        }
      }
      
      handsRef.current = null;
      cameraRef.current = null;
      setIsReady(false);
    };
  }, [
    videoRef,
    maxNumHands,
    modelComplexity,
    minDetectionConfidence,
    minTrackingConfidence,
    handleResults
  ]);

  /**
   * Start the camera
   */
  const start = useCallback(() => {
    cameraRef.current?.start();
  }, []);

  /**
   * Stop the camera
   */
  const stop = useCallback(() => {
    cameraRef.current?.stop();
  }, []);

  return {
    isReady,
    error,
    start,
    stop
  };
}

// Default export for compatibility
export default useMediaPipe;
