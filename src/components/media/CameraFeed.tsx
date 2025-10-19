"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onFrame?: () => void;
  deviceId?: string;                         // <— select camera
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
  showOverlay?: boolean;                     // <— draw landmarks if provided
  landmarks?: number[][] | null;             // shape [21][3] (x,y in 0..1)
  _attachVideoRef?: (el: HTMLVideoElement | null) => void;
};

export default function CameraFeed({
  onFrame,
  deviceId,
  facingMode = "user",
  width = 1280,
  height = 720,
  showOverlay = false,
  landmarks = null,
  _attachVideoRef,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid re-triggering camera setup
  const onFrameRef = useRef(onFrame);
  const showOverlayRef = useRef(showOverlay);
  const landmarksRef = useRef(landmarks);
  
  // Keep refs updated
  useEffect(() => {
    onFrameRef.current = onFrame;
    showOverlayRef.current = showOverlay;
    landmarksRef.current = landmarks;
  }, [onFrame, showOverlay, landmarks]);

  // Expose the <video> element to parent (for ML)
  useEffect(() => {
    _attachVideoRef?.(videoRef.current);
    return () => _attachVideoRef?.(null);
  }, [_attachVideoRef]);

  // Start/Restart stream when deviceId or constraints change
  useEffect(() => {
    console.log('🎥 CameraFeed useEffect triggered');
    let raf = 0;
    let currentStream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('📹 Starting camera with deviceId:', deviceId);
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: deviceId
            ? { deviceId: { exact: deviceId }, width: { ideal: width }, height: { ideal: height } }
            : { facingMode, width: { ideal: width }, height: { ideal: height } },
        };
        
        console.log('📸 Requesting camera access...');
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✅ Camera stream obtained');
        
        if (!isMounted || !videoRef.current) {
          // Component unmounted before stream was ready
          console.log('⚠️ Component unmounted, stopping stream');
          currentStream.getTracks().forEach(t => t.stop());
          return;
        }

        const video = videoRef.current;
        video.srcObject = currentStream;
        console.log('🎬 Stream attached to video element');
        
        // Wait for video to be ready
        video.onloadedmetadata = () => {
          console.log('📺 Video metadata loaded');
          if (isMounted && videoRef.current) {
            video.play()
              .then(() => {
                console.log('▶️ Video playing');
                setIsLoading(false);
              })
              .catch(err => {
                console.error('❌ Error playing video:', err);
                setError('Failed to play video');
                setIsLoading(false);
              });
          }
        };

        const loop = () => {
          if (!isMounted) return;
          
          onFrameRef.current?.();
          // draw overlay (landmarks in video pixel space)
          if (showOverlayRef.current && canvasRef.current && video.videoWidth) {
            const ctx = canvasRef.current.getContext("2d")!;
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            if (landmarksRef.current && landmarksRef.current.length) {
              ctx.lineWidth = 2;
              ctx.strokeStyle = "#00FF99";
              ctx.fillStyle = "#00FF99";
              for (const [x, y] of landmarksRef.current) {
                const px = x * canvasRef.current.width;
                const py = y * canvasRef.current.height;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
              }
              // optional: connect a few typical bones (thumb/index only as example)
              const bonePairs = [[0,1],[1,2],[2,3],[3,4], [5,6],[6,7],[7,8]];
              ctx.beginPath();
              for (const [a,b] of bonePairs) {
                const [ax, ay] = landmarksRef.current[a];
                const [bx, by] = landmarksRef.current[b];
                ctx.moveTo(ax * canvasRef.current.width, ay * canvasRef.current.height);
                ctx.lineTo(bx * canvasRef.current.width, by * canvasRef.current.height);
              }
              ctx.stroke();
            }
          }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      } catch (err) {
        console.error('❌ Camera error:', err);
        setError(err instanceof Error ? err.message : 'Failed to access camera');
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      cancelAnimationFrame(raf);
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [deviceId, facingMode, width, height]); // Removed onFrame, showOverlay, landmarks from deps

  return (
    <div className="relative w-full aspect-video bg-black/20 rounded-2xl overflow-hidden">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-white text-sm">Starting camera...</p>
          </div>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 z-10">
          <div className="text-center p-4">
            <p className="text-white text-lg font-bold mb-2">❌ Camera Error</p>
            <p className="text-white text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <video 
        ref={videoRef} 
        autoPlay
        playsInline 
        muted
        className="w-full h-full object-cover rounded-2xl" 
        aria-label="Camera feed" 
      />
      {showOverlay && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-2xl"
        />
      )}
    </div>
  );
}
