import React from "react";
import { motion } from "motion/react";
import { Box, Sparkles } from "lucide-react";

interface ShowroomLoadingProgressProps {
  progress?: number;
  item?: string;
  glowColor?: string;
  isCompact?: boolean;
}

export const ShowroomLoadingProgress: React.FC<ShowroomLoadingProgressProps> = ({
  progress = 0,
  item = "",
  glowColor = "#ef4444",
  isCompact = false
}) => {
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-neutral-950/90 border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-red-500 animate-spin" />
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 text-[11px] font-bold text-white">
            <span>3D Model Yükleniyor</span>
            <span className="font-mono text-red-400">%{roundedProgress}</span>
          </div>
          <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-200"
              style={{ width: `${roundedProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-950/70 backdrop-blur-sm p-6 rounded-3xl"
    >
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center bg-neutral-900/90 border border-white/15 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-20 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: glowColor }}
        />

        {/* 3D Model Badge Icon */}
        <div className="relative mb-3 flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-xl border flex items-center justify-center relative shadow-lg"
            style={{
              borderColor: `${glowColor}50`,
              backgroundColor: `${glowColor}15`
            }}
          >
            <Box className="w-6 h-6 animate-pulse" style={{ color: glowColor }} />
          </div>
          <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Status text & Percentage */}
        <div className="w-full flex items-baseline justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: glowColor }} />
            3D Sahne Hazırlanıyor
          </span>
          <span className="text-sm font-black font-mono tracking-tight" style={{ color: glowColor }}>
            %{roundedProgress}
          </span>
        </div>

        {/* High-tech Progress Bar */}
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
          <motion.div
            className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
            style={{
              width: `${Math.max(5, roundedProgress)}%`,
              background: `linear-gradient(90deg, ${glowColor}, #ffffff)`
            }}
          >
            {/* Shimmer light pass */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          </motion.div>
        </div>

        {/* Sub-label description */}
        <div className="w-full mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
          <span className="truncate max-w-[200px]">
            {item ? item.split("/").pop() || "KTX2 & GPU Shaders" : "PBR Dokuları & Geometri Transcoding"}
          </span>
          <span className="font-mono text-slate-500 font-semibold">60 FPS WebGL</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ShowroomLoadingProgress;
