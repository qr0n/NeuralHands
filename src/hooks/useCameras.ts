import { useEffect, useState } from "react";

export type CameraDevice = { deviceId: string; label: string };

export function useCameras() {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // On some browsers labels are blank until permission is granted
      await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).catch(() => {});
      const list = await navigator.mediaDevices.enumerateDevices();
      const cams = list
        .filter((d) => d.kind === "videoinput")
        .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Camera ${i + 1}` }));
      if (!mounted) return;
      setDevices(cams);
      if (!selectedId && cams[0]) setSelectedId(cams[0].deviceId);
    })();
    return () => { mounted = false; };
  }, []);

  return { devices, selectedId, setSelectedId };
}
