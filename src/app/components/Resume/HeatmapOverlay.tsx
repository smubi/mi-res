"use client";
import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  value: number;
}

interface HeatmapOverlayProps {
  width: number;
  height: number;
  points?: Point[];
}

export const HeatmapOverlay = ({ width, height, points: customPoints }: HeatmapOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Default points if none provided (simulating eye-tracking on a resume)
    const points: Point[] = customPoints || [
      { x: 0.25, y: 0.08, value: 0.9 }, // Name area
      { x: 0.22, y: 0.09, value: 0.7 },
      { x: 0.28, y: 0.07, value: 0.6 },
      
      { x: 0.5, y: 0.1, value: 0.4 }, // Contact info
      
      { x: 0.3, y: 0.22, value: 0.95 }, // Current Job Title
      { x: 0.25, y: 0.23, value: 0.8 },
      { x: 0.35, y: 0.21, value: 0.7 },
      
      { x: 0.8, y: 0.22, value: 0.85 }, // Current Job Dates
      { x: 0.78, y: 0.23, value: 0.6 },
      
      { x: 0.3, y: 0.38, value: 0.9 }, // Previous Job Title
      { x: 0.25, y: 0.39, value: 0.75 },
      
      { x: 0.8, y: 0.38, value: 0.7 }, // Previous Job Dates
      
      { x: 0.3, y: 0.55, value: 0.8 }, // Education Section
      { x: 0.25, y: 0.56, value: 0.6 },
      
      { x: 0.3, y: 0.75, value: 0.5 }, // Skills Section
      { x: 0.4, y: 0.76, value: 0.4 },
      
      { x: 0.15, y: 0.45, value: 0.3 }, // Random scan
      { x: 0.85, y: 0.65, value: 0.2 },
    ];

    // Create a temporary canvas to draw the radial gradients (intensity map)
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    points.forEach((point) => {
      const x = point.x * width;
      const y = point.y * height;
      const radius = 60;
      const intensity = point.value;

      const gradient = tempCtx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });

    // Colorize the intensity map
    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha > 0) {
        // Map alpha (0-255) to a color spectrum
        // 0 (cool) -> 255 (warm)
        const color = getColorForIntensity(alpha / 255);
        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = alpha * 0.6; // Adjust overall opacity
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [width, height, customPoints]);

  // Helper to get color from blue (cool) to red (warm)
  const getColorForIntensity = (intensity: number) => {
    // Simple rainbow gradient: Blue -> Cyan -> Green -> Yellow -> Red
    const colors = [
      { r: 0, g: 0, b: 255 },    // Blue
      { r: 0, g: 255, b: 255 },  // Cyan
      { r: 0, g: 255, b: 0 },    // Green
      { r: 255, g: 255, b: 0 },  // Yellow
      { r: 255, g: 0, b: 0 },    // Red
    ];

    const idx = Math.floor(intensity * (colors.length - 1));
    const nextIdx = Math.min(idx + 1, colors.length - 1);
    const factor = (intensity * (colors.length - 1)) - idx;

    const r = Math.round(colors[idx].r + (colors[nextIdx].r - colors[idx].r) * factor);
    const g = Math.round(colors[idx].g + (colors[nextIdx].g - colors[idx].g) * factor);
    const b = Math.round(colors[idx].b + (colors[nextIdx].b - colors[idx].b) * factor);

    return { r, g, b };
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none absolute inset-0 z-20"
      style={{ mixBlendMode: "multiply" }}
    />
  );
};
