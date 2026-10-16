"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { createQrDetector } from "./qr-detector";

export type CameraProblem = "permission" | "no-camera" | "insecure" | "unavailable";

function problemFrom(error: unknown): CameraProblem {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "permission";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "no-camera";
  return "unavailable";
}

// Muestra la cámara trasera y avisa el primer QR que lee. La cámara se apaga al leerlo y al desmontar
// u ocultar la pantalla.
export function QrCamera({
  onDetect,
  onProblem,
}: {
  onDetect: (text: string) => void;
  onProblem: (problem: CameraProblem) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detected = useEffectEvent(onDetect);
  const failed = useEffectEvent(onProblem);

  useEffect(() => {
    let stopped = false;
    let stream: MediaStream | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) return failed("insecure");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch (error) {
        return failed(problemFrom(error));
      }
      const video = videoRef.current;
      if (stopped || !video) return stop();
      video.srcObject = stream;
      await video.play().catch(() => undefined);
      const detector = await createQrDetector();

      const tick = async () => {
        if (stopped) return;
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          const [code] = await detector.detect(video).catch(() => []);
          if (code?.rawValue && !stopped) {
            stop();
            return detected(code.rawValue);
          }
        }
        timer = setTimeout(tick, 200);
      };
      tick();
    }

    start();
    return stop;
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
      <video ref={videoRef} muted playsInline className="size-full object-cover" />
      <div className="pointer-events-none absolute inset-[15%] rounded-2xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
    </div>
  );
}
