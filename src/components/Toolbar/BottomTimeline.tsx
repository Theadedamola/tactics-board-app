import React from 'react';
import { Play, Pause, Plus, RotateCcw, Film } from 'lucide-react';
import { TacticalFrame } from '../../types/tactics';

interface BottomTimelineProps {
  keyframes: TacticalFrame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  onAddKeyframe: () => void;
  onSelectFrame: (index: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const BottomTimeline: React.FC<BottomTimelineProps> = ({
  keyframes,
  currentFrameIndex,
  isPlaying,
  onAddKeyframe,
  onSelectFrame,
  onTogglePlay,
  onReset,
}) => {
  return (
    <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-3">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
            isPlaying
              ? 'bg-amber-400 text-slate-950 shadow-amber-400/30 animate-pulse'
              : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/30'
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY REPLAY'}</span>
        </button>

        <button
          onClick={onReset}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all"
          title="Reset to Initial Phase"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Frame Sequence Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
          <Film size={13} /> SEQUENCE:
        </span>
        {keyframes.map((frame, idx) => {
          const isActive = idx === currentFrameIndex;
          return (
            <button
              key={frame.id}
              onClick={() => onSelectFrame(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-white text-slate-950 border-white shadow-md scale-105'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              Phase {idx + 1}
            </button>
          );
        })}

        <button
          onClick={onAddKeyframe}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all"
        >
          <Plus size={14} /> Add Frame
        </button>
      </div>
    </div>
  );
};
