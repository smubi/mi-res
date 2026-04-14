"use client";
import { useEffect, useRef } from "react";
import type { Resume } from "lib/redux/types";

interface Point {
  x: number;
  y: number;
  value: number;
}

interface HeatmapOverlayProps {
  width: number;
  height: number;
  resume: Resume;
}

export const HeatmapOverlay = ({ width, height, resume }: HeatmapOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Generate dynamic points based on resume content presence
    const points: Point[] = [];

    // 1. Name & Contact (Top Area)
    if (resume.profile.name) {
      points.push({ x: 0.25, y: 0.08, value: 0.9 });
      points.push({ x: 0.22, y: 0.09, value: 0.7 });
    }
    if (resume.profile.email || resume.profile.phone) {
      points.push({ x: 0.5, y: 0.1, value: 0.4 });
    }

    // 2. Current Job (First Work Experience)
    if (resume.workExperiences.length > 0) {
      const job = resume.workExperiences[0];
      if (job.jobTitle || job.company) {
        points.push({ x: 0.3, y: 0.22, value: 0.95 }); // Title/Company
        points.push({ x: 0.25, y: 0.23, value: 0.8 });
      }
      if (job.date) {
        points.push({ x: 0.8, y: 0.22, value: 0.85 }); // Dates
      }
    }

    // 3. Previous Job (Second Work Experience)
    if (resume.workExperiences.length > 1) {
      const job = resume.workExperiences[1];
      if (job.jobTitle || job.company) {
        points.push({ x: 0.3, y: 0.38, value: 0.9 });
        points.push({ x: 0.25, y: 0.39, value: 0.75 });
      }
      if (job.date) {
        points.push({ x: 0.8, y: 0.38, value: 0.7 });
      }
    }

    // 4. Education
    if (resume.educations.length > 0) {
      points.push({ x: 0.3, y: 0.55, value: 0.8 });
      points.push({ x: 0.25, y: 0.56, value: 0.6 });
    }

    // 5. Skills (Lower priority in 6-sec scan but still scanned)
    if (resume.skills.descriptions.length > 0 || resume.skills.featuredSkills.some(s => s.skill)) {
      points.push({ x: 0.3, y: 0.75, value: 0.5 });
      points.push({ x: 0.4, y: 0.76, value: 0.4 });
    }

    // Add some "F-pattern" scanning noise
    points.push({ x: 0.15, y: 0.45, value: 0.3 });
    points.push({ x: 0.85, y: 0.65, value: 0.2 });

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    points.forEach((point) => {
      const x = point.x * width;
      const y = point.y * height;
      const radius = 70;
      const intensity = point.value;

      const gradient = tempCtx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });

    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha > 0) {
        const color = getColorForIntensity(alpha / 255);
        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = alpha * 0.5; 
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [width, height, resume]);

  const getColorForIntensity = (intensity: number) => {
    const colors = [
      { r: 59, g: 130, b: 246 },   // Blue (500)
      { r: 34, g: 197, b: 94 },   // Green (500)
      { r: 234, g: 179, b: 8 },   // Yellow (500)
      { r: 249, g: 115, b: 22 },  // Orange (500)
      { r: 239, g: 68, b: 68 },   // Red (500)
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