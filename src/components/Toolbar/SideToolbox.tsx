import React, { useState } from 'react';
import { BoardState, FormationType, TeamSide, ToolType } from '../../types/tactics';
import { FormationPicker } from '../Remote/FormationPicker';
import { ToolPalette } from '../Remote/ToolPalette';
import { ChevronRight, ChevronLeft, Shield, Sliders } from 'lucide-react';

interface SideToolboxProps {
  boardState: BoardState;
  onSetFormation: (team: TeamSide, formation: FormationType) => void;
  onSelectTool: (tool: ToolType) => void;
  onToggleSpotlight: () => void;
  onClearDrawings: () => void;
  onQuickPreset: (action: 'high_press' | 'low_block' | 'compact') => void;
  onSetTeamVisibility?: (visibility: 'both' | 'home' | 'away') => void;
  onSwitchSides?: () => void;
  onSwapColors?: () => void;
}

export const SideToolbox: React.FC<SideToolboxProps> = ({
  boardState,
  onSetFormation,
  onSelectTool,
  onToggleSpotlight,
  onClearDrawings,
  onQuickPreset,
  onSetTeamVisibility,
  onSwitchSides,
  onSwapColors,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const selectedPlayer = boardState.players.find((p) => p.id === boardState.selectedPlayerId);

  return (
    <div
      className={`fixed top-16 left-4 bottom-20 z-30 transition-all duration-300 flex ${
        isOpen ? 'w-80' : 'w-10'
      }`}
    >
      {/* Container Card */}
      <div
        className={`w-full h-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col overflow-y-auto space-y-4 transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Tactical Suite
            </span>
          </div>
        </div>

        {/* Team Visibility Quick Filter */}
        {onSetTeamVisibility && (
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1">
              Teams Display
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onSetTeamVisibility('both')}
                className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                  boardState.teamVisibility === 'both'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Both (22)
              </button>
              <button
                onClick={() => onSetTeamVisibility('home')}
                className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                  boardState.teamVisibility === 'home'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-cyan-400 hover:text-white'
                }`}
              >
                Home Only
              </button>
              <button
                onClick={() => onSetTeamVisibility('away')}
                className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                  boardState.teamVisibility === 'away'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-rose-400 hover:text-white'
                }`}
              >
                Away Only
              </button>
            </div>
          </div>
        )}

        {/* Selected Player Status */}
        {selectedPlayer && (
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white ${
                  selectedPlayer.team === 'home' ? 'bg-cyan-600' : 'bg-rose-600'
                }`}
              >
                {selectedPlayer.number}
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {selectedPlayer.role} {selectedPlayer.name}
                </div>
                <div className="text-[10px] text-slate-400 uppercase">
                  {selectedPlayer.team} Team
                </div>
              </div>
            </div>

            <button
              onClick={onToggleSpotlight}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                selectedPlayer.isSpotlight
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-slate-800 text-amber-400 border-slate-700'
              }`}
            >
              {selectedPlayer.isSpotlight ? 'Pinned' : 'Spotlight'}
            </button>
          </div>
        )}

        {/* Formations Module */}
        <FormationPicker
          currentHomeFormation={boardState.homeFormation}
          currentAwayFormation={boardState.awayFormation}
          homeColor={boardState.homeColor}
          awayColor={boardState.awayColor}
          homeTeamName={boardState.homeTeamName}
          awayTeamName={boardState.awayTeamName}
          onSetFormation={onSetFormation}
          onQuickPreset={onQuickPreset}
          onSwapColors={onSwapColors}
          onSwitchSides={onSwitchSides}
        />

        {/* Analysis Tools Module */}
        <ToolPalette
          activeTool={boardState.activeTool}
          hasSelectedPlayer={!!selectedPlayer}
          onSelectTool={onSelectTool}
          onClearAll={onClearDrawings}
          onToggleSpotlight={onToggleSpotlight}
          isSpotlightActive={!!selectedPlayer?.isSpotlight}
        />
      </div>

      {/* Collapse Toggle Handle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="self-center -ml-3 z-40 w-7 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-r-xl flex items-center justify-center text-slate-300 shadow-xl transition-all"
        title={isOpen ? 'Collapse Panel' : 'Expand Tactical Suite'}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
};
