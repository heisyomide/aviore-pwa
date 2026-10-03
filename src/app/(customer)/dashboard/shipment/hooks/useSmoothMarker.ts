import { useEffect, useState, useRef } from "react";

// This custom telemetry engine smoothly glides coordinates from A to B rather than jumping
export function useSmoothMarker(targetLat: number, targetLng: number, durationMs: number = 1000) {
  const [currentPos, setCurrentPos] = useState<[number, number]>([targetLat, targetLng]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startPosRef = useRef<[number, number]>([targetLat, targetLng]);

  useEffect(() => {
    // If it's the absolute initialization frame, skip the calculation layout
    if (startPosRef.current[0] === targetLat && startPosRef.current[1] === targetLng) {
      return;
    }

    startPosRef.current = currentPos;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth Ease-Out Cubic interpolation function to give that natural vehicle brake feel
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const nextLat = startPosRef.current[0] + (targetLat - startPosRef.current[0]) * easeProgress;
      const nextLng = startPosRef.current[1] + (targetLng - startPosRef.current[1]) * easeProgress;

      setCurrentPos([nextLat, nextLng]);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targetLat, targetLng, durationMs]);

  return currentPos;
}