"use client";
import { useEffect, useRef } from "react";
import type { Resume } from "lib/redux/types";

interface Point {
  x: number;
  y: number;
  value: number;
  label?: string;
}

interface HeatmapOverlayProps {
  width: number;
  height: number;
  resume: Resume;
  showPath?: boolean;
}

export const HeatmapOverlay = ({ width, height, resume, showPath = false }: HeatmapOverlayProps) => {
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
      points.push({ x: 0.25, y: 0.08, value: 0.9, label: "Name" });
    }
    
    // 2. Current Job (First Work Experience)
    if (resume.workExperiences.length > 0) {
      const job = resume.workExperiences[0];
      if (job.jobTitle || job.company) {
        points.push({ x: 0.3, y: 0.22, value: 0.95, label: "Current Role" });
      }
      if (job.date) {
        points.push({ x: 0.8, y: 0.22, value: 0.85, label: "Dates" });
      }
    }

    // 3. Previous Job (Second Work Experience)
    if (resume.workExperiences.length > 1) {
      const job = resume.workExperiences[1];
      if (job.jobTitle || job.company) {
        points.push({ x: 0.3, y: 0.38, value: 0.9, label: "Previous Role" });
      }
      if (job.date) {
        points.push({ x: 0.8, y: 0.38, value: 0.7, label: "Dates" });
      }
    }

    // 4. Education
    if (resume.educations.length > 0) {
      points.push({ x: 0.3, y: 0.55, value: 0.8, label: "Education" });
    }

    // 5. Skills
    if (resume.skills.descriptions.length > 0 || resume.skills.featuredSkills.some(s => s.skill)) {
      points.push({ x: 0.3, y: 0.75, value: 0.5, label: "Skills" });
    }

    // Draw Heatmap
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
        data[i + 3] = alpha * 0.4; 
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw Scanning Path (F-Pattern)
    if (showPath && points.length > 1) {
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(147, 51, 234, 0.6)"; // Purple-600
      ctx.lineWidth = 2;

      points.forEach((point, idx) => {
        const x = point.x * width;
        const y = point.y * height;
        
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Draw fixation point
        ctx.save();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(147, 51, 234, 0.8)";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label
        if (point.label) {
          ctx.font = "bold 10px sans-serif";
          ctx.fillStyle = "rgba(147, 51, 234, 1)";
          ctx.fillText(`${idx + 1}. ${point.label}`, x + 8, y + 4);
        }
        ctx.restore();
      });
      ctx.stroke();
    }
  }, [width, height, resume, showPath]);

  const getColorForIntensity = (intensity: number) => {
    const colors = [
      { r: 59, g: 130, b: 246 },   // Blue
      { r: 34, g: 197, b: 94 },   // Green
      { r: 234, g: 179, b: 8 },   // Yellow
      { r: 249, g: 115, b: 22 },  // Orange
      { r: 239, g: 68, b: 68 },   // Red
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