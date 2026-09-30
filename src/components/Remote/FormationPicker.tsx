import React, { useState } from 'react';
import { FormationType, TeamSide } from '../../types/tactics';
import { FORMATION_PRESETS } from '../../constants/formations';
import { Shield, Zap, MoveDown, MoveUp, ArrowLeftRight, Palette } from 'lucide-react';

interface FormationPickerProps {
  currentHomeFormation: FormationType;
  currentAwayFormation: FormationType;
  homeColor?: string;
  awayColor?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  onSetFormation: (team: TeamSide, formation: FormationType) => void;
  onQuickPreset?: (action: 'high_press' | 'low_block' | 'compact') => void;
  onSwapColors?: () => void;
  onSwitchSides?: () => void;
}

const FORMATIONS: FormationType[] = [
  '4-3-3',
  '4-2-3-1',
  '4-4-2',
  '3-5-2',
  '3-4-3',
  '5-3-2',
  '5-4-1',
  '4-1-4-1',
];

export const FormationPicker: React.FC<FormationPickerProps> = ({
  currentHomeFormation,
  currentAwayFormation,
  homeColor = '#00c3ff',
  awayColor = '#ff3366',
  homeTeamName = 'HOME',
  awayTeamName = 'AWAY',
  onSetFormation,
  onQuickPreset,
  onSwapColors,
  onSwitchSides,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamSide>('home');

  const currentFormation = selectedTeam === 'home' ? currentHomeFormation : currentAwayFormation;

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-xl">
      {/* Team Toggle */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 items-center gap-1">
        <button
          onClick={() => setSelectedTeam('home')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            selectedTeam === 'home'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: homeColor }} />
          <span>{homeTeamName}</span>
        </button>

        {onSwapColors && (
          <button
            onClick={onSwapColors}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all text-[10px]"
            title="Swap Kit Colors (Red ↔ Blue)"
          >
            <ArrowLeftRight size={13} />
          </button>
        )}

        <button
          onClick={() => setSelectedTeam('away')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            selectedTeam === 'away'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: awayColor }} />
          <span>{awayTeamName}</span>
        </button>
      </div>

      {/* Switch Sides Banner */}
      {onSwitchSides && (
        <button
          onClick={onSwitchSides}
          className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <ArrowLeftRight size={14} />
          <span>Switch Pitch Sides (Flip Home & Away)</span>
        </button>
      )}

      {/* Formation Grid */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
          Select Formation Preset
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FORMATIONS.map((fmt) => {
            const isActive = currentFormation === fmt;
            return (
              <button
                key={fmt}
                onClick={() => onSetFormation(selectedTeam, fmt)}
                className={`py-3 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                  isActive
                    ? 'bg-white text-slate-950 border-white shadow-lg scale-105'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-500 active:scale-95'
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tactical Line Presets */}
      {onQuickPreset && (
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Defensive Line Shift
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onQuickPreset('high_press')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] font-semibold text-amber-400 active:scale-95 transition-all"
            >
              <MoveUp size={14} /> High Press
            </button>
            <button
              onClick={() => onQuickPreset('compact')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] font-semibold text-cyan-400 active:scale-95 transition-all"
            >
              <Shield size={14} /> Mid Block
            </button>
            <button
              onClick={() => onQuickPreset('low_block')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] font-semibold text-rose-400 active:scale-95 transition-all"
            >
              <MoveDown size={14} /> Low Block
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
