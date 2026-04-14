"use client";
import { useEffect, useRef, useState } from "react";
import type { Resume } from "lib/redux/types";

interface Point {
  x: number;
  y: number;
  value: number;
  label?: string;
  type?: "header" | "role" | "date" | "skill" | "education";
}

interface HeatmapOverlayProps {
  width: number;
  height: number;
  resume: Resume;
  showPath?: boolean;
}

export const HeatmapOverlay = ({ width, height, resume, showPath = false }: HeatmapOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanY, setScanY] = useState(-10);
  const requestRef = useRef<number>();

  // Animation for the scanning line
  useEffect(() => {
    if (!showPath) {
      setScanY(-10);
      return;
    }

    let start: number | null = null;
    const duration = 6000; // 6 seconds to match the simulation

    const animate = (time: number) => {
      if (!start) start = time;
      const progress = (time - start) / duration;
      
      if (progress <= 1) {
        setScanY(progress * height);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setScanY(-10);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [showPath, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Generate dynamic points based on resume content
    const points: Point[] = [];

    // 1. Name & Contact (Top Area) - High focus
    if (resume.profile.name) {
      points.push({ x: 0.25, y: 0.06, value: 0.95, label: "Name", type: "header" });
    }
    if (resume.profile.email || resume.profile.phone) {
      points.push({ x: 0.25, y: 0.09, value: 0.6, label: "Contact", type: "header" });
    }
    
    // 2. Professional Summary
    if (resume.profile.summary) {
      points.push({ x: 0.3, y: 0.15, value: 0.8, label: "Summary", type: "header" });
    }

    // 3. Work Experiences - The "F" pattern focus
    resume.workExperiences.forEach((job, idx) => {
      if (idx > 3) return; // Only focus on first few
      const baseY = 0.22 + (idx * 0.15);
      
      if (job.jobTitle || job.company) {
        points.push({ x: 0.3, y: baseY, value: 0.9 - (idx * 0.1), label: idx === 0 ? "Current Role" : "Previous Role", type: "role" });
      }
      if (job.date) {
        points.push({ x: 0.8, y: baseY, value: 0.85 - (idx * 0.1), label: "Dates", type: "date" });
      }
      
      // Bullet points focus (first two usually)
      if (job.descriptions.length > 0) {
        points.push({ x: 0.35, y: baseY + 0.04, value: 0.7 - (idx * 0.1), type: "role" });
        if (job.descriptions.length > 1) {
          points.push({ x: 0.35, y: baseY + 0.07, value: 0.5 - (idx * 0.1), type: "role" });
        }
      }
    });

    // 4. Education
    if (resume.educations.length > 0) {
      const eduY = Math.min(0.85, 0.22 + (resume.workExperiences.length * 0.15));
      points.push({ x: 0.3, y: eduY, value: 0.7, label: "Education", type: "education" });
    }

    // 5. Skills - Usually scanned quickly at the end or side
    if (resume.skills.featuredSkills.length > 0 || resume.skills.descriptions.length > 0) {
      const skillsY = Math.min(0.92, 0.3 + (resume.workExperiences.length * 0.15));
      points.push({ x: 0.3, y: skillsY, value: 0.6, label: "Skills", type: "skill" });
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
      const radius = point.type === 'header' ? 90 : 70;
      const intensity = point.value;

      const gradient = tempCtx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
      gradient.addColorStop(0.5, `rgba(0, 0, 0, ${intensity * 0.5})`);
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
          // Add some "jitter" to the path to make it look more like eye movement
          const cp1x = x + (Math.random() - 0.5) * 50;
          const cp1y = y + (Math.random() - 0.5) * 50;
          ctx.quadraticCurveTo(cp1x, cp1y, x, y);
        }

        // Draw fixation point
        ctx.save();
        ctx.setLineDash([]);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(147, 51, 234, 0.5)";
        ctx.fillStyle = "rgba(147, 51, 234, 0.8)";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label
        if (point.label) {
          ctx.font = "bold 12px sans-serif";
          ctx.fillStyle = "white";
          ctx.strokeStyle = "rgba(147, 51, 234, 1)";
          ctx.lineWidth = 3;
          ctx.strokeText(`${idx + 1}. ${point.label}`, x + 12, y + 4);
          ctx.fillText(`${idx + 1}. ${point.label}`, x + 12, y + 4);
        }
        ctx.restore();
      });
      ctx.stroke();

      // Draw Scanning Line
      if (scanY > 0 && scanY < height) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.strokeStyle = "rgba(147, 51, 234, 0.8)";
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        
        // Add a glow to the scanning line
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(147, 51, 234, 0.8)";
        ctx.stroke();

        // Add "Scanning" text
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = "rgba(147, 51, 234, 1)";
        ctx.fillText("RECRUITER EYE TRACKING ACTIVE", 10, scanY - 5);
        ctx.restore();
      }
    }
  }, [width, height, resume, showPath, scanY]);

  const getColorForIntensity = (intensity: number) => {
    // Improved color map for more realistic heatmap
    const colors = [
      { r: 59, g: 130, b: 246 },   // Blue (Cold)
      { r: 34, g: 197, b: 94 },   // Green
      { r: 234, g: 179, b: 8 },   // Yellow
      { r: 249, g: 115, b: 22 },  // Orange
      { r: 239, g: 68, b: 68 },   // Red (Hot)
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