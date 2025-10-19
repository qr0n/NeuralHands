"use client";

import { useEffect, useRef } from "react";

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

  // Expose the <video> element to parent (for ML)
  useEffect(() => {
    _attachVideoRef?.(videoRef.current);
    return () => _attachVideoRef?.(null);
  }, [_attachVideoRef]);

  // Start/Restart stream when deviceId or constraints change
  useEffect(() => {
    let raf = 0;
    let currentStream: MediaStream | null = null;

    (async () => {
      // Stop previous stream
      const stop = () => currentStream?.getTracks().forEach(t => t.stop());
      try {
        stop();
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: deviceId
            ? { deviceId: { exact: deviceId }, width: { ideal: width }, height: { ideal: height } }
            : { facingMode, width: { ideal: width }, height: { ideal: height } },
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = videoRef.current!;
        video.srcObject = currentStream;
        await video.play();

        const loop = () => {
          onFrame?.();
          // draw overlay (landmarks in video pixel space)
          if (showOverlay && canvasRef.current && video.videoWidth) {
            const ctx = canvasRef.current.getContext("2d")!;
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            if (landmarks && landmarks.length) {
              ctx.lineWidth = 2;
              ctx.strokeStyle = "#00FF99";
              ctx.fillStyle = "#00FF99";
              for (const [x, y] of landmarks) {
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
                const [ax, ay] = landmarks[a];
                const [bx, by] = landmarks[b];
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
        console.error(err);
      }

      return () => {
        cancelAnimationFrame(raf);
        currentStream?.getTracks().forEach((t) => t.stop());
      };
    })();

    return () => {
      cancelAnimationFrame(raf);
      currentStream?.getTracks().forEach((t) => t.stop());
    };
  }, [deviceId, facingMode, width, height, onFrame, showOverlay, landmarks]);

  return (
    <div className="relative w-full">
      <video ref={videoRef} playsInline className="w-full rounded-2xl" aria-label="Camera feed" />
      {showOverlay && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-2xl"
        />
      )}
    </div>
  );
}
