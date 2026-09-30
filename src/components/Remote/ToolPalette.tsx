import React from 'react';
import { ToolType } from '../../types/tactics';
import {
  Sparkles,
  Navigation,
  ArrowUpRight,
  ShieldAlert,
  Ruler,
  Trash2,
  MousePointer,
  PenTool,
} from 'lucide-react';

interface ToolPaletteProps {
  activeTool: ToolType;
  hasSelectedPlayer: boolean;
  onSelectTool: (tool: ToolType) => void;
  onClearAll: () => void;
  onToggleSpotlight: () => void;
  isSpotlightActive: boolean;
}

export const ToolPalette: React.FC<ToolPaletteProps> = ({
  activeTool,
  hasSelectedPlayer,
  onSelectTool,
  onClearAll,
  onToggleSpotlight,
  isSpotlightActive,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
          Tactical Analysis Tools
        </span>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 active:scale-95 transition-all bg-rose-950/40 px-2 py-1 rounded-md border border-rose-800/60"
        >
          <Trash2 size={12} /> Clear Screen
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Spotlight Tool */}
        <button
          onClick={onToggleSpotlight}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            isSpotlightActive
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
          }`}
        >
          <Sparkles size={20} className={isSpotlightActive ? 'text-slate-950' : 'text-amber-400'} />
          <span className="text-[11px] font-bold mt-1">Spotlight</span>
          <span className="text-[9px] opacity-75">
            {hasSelectedPlayer ? 'Pin Player' : 'Select player'}
          </span>
        </button>

        {/* Curved Run Arrow */}
        <button
          onClick={() => onSelectTool(activeTool === 'curve_run' ? 'select' : 'curve_run')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activeTool === 'curve_run'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
          }`}
        >
          <Navigation size={20} className={activeTool === 'curve_run' ? 'text-slate-950' : 'text-cyan-400'} />
          <span className="text-[11px] font-bold mt-1">Curved Run</span>
          <span className="text-[9px] opacity-75">Cut Inside/Overlap</span>
        </button>

        {/* Pass Line */}
        <button
          onClick={() => onSelectTool(activeTool === 'arrow_pass' ? 'select' : 'arrow_pass')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activeTool === 'arrow_pass'
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-lg shadow-yellow-400/30'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
          }`}
        >
          <ArrowUpRight size={20} className={activeTool === 'arrow_pass' ? 'text-slate-950' : 'text-yellow-400'} />
          <span className="text-[11px] font-bold mt-1">Pass Laser</span>
          <span className="text-[9px] opacity-75">Target Line</span>
        </button>

        {/* Defensive Compactness */}
        <button
          onClick={() => onSelectTool(activeTool === 'compactness' ? 'select' : 'compactness')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activeTool === 'compactness'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
          }`}
        >
          <ShieldAlert size={20} className={activeTool === 'compactness' ? 'text-slate-950' : 'text-emerald-400'} />
          <span className="text-[11px] font-bold mt-1">Compactness</span>
          <span className="text-[9px] opacity-75">Back 4 Block</span>
        </button>

        {/* Distance Tape */}
        <button
          onClick={() => onSelectTool(activeTool === 'distance' ? 'select' : 'distance')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activeTool === 'distance'
              ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-lg shadow-purple-500/30'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
          }`}
        >
          <Ruler size={20} className={activeTool === 'distance' ? 'text-slate-950' : 'text-purple-400'} />
          <span className="text-[11px] font-bold mt-1">Measure</span>
          <span className="text-[9px] opacity-75">Meters Gap</span>
        </button>

        {/* Freehand Pen */}
        <button
          onClick={() => onSelectTool(activeTool === 'pen' ? 'select' : 'pen')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activeTool === 'pen'
              ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
          }`}
        >
          <PenTool size={20} className={activeTool === 'pen' ? 'text-white' : 'text-rose-400'} />
          <span className="text-[11px] font-bold mt-1">Telestrator</span>
          <span className="text-[9px] opacity-75">Freehand Draw</span>
        </button>
      </div>
    </div>
  );
};
