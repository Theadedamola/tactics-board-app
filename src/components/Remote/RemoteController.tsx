import React, { useState } from 'react';
import { BoardState, FormationType, Player, TeamSide, ToolType } from '../../types/tactics';
import { MiniPitchPad } from './MiniPitchPad';
import { FormationPicker } from './FormationPicker';
import { ToolPalette } from './ToolPalette';
import { BottomTimeline } from '../Toolbar/BottomTimeline';
import { ConnectionStatus } from '../../services/peerSync';
import { Tv, Sparkles, SlidersHorizontal, Layers, Play, Radio } from 'lucide-react';

interface RemoteControllerProps {
  boardState: BoardState;
  status: ConnectionStatus;
  roomId: string;
  onMovePlayer: (id: string, x: number, y: number) => void;
  onMoveBall: (x: number, y: number) => void;
  onSelectPlayer: (player: Player) => void;
  onSetFormation: (team: TeamSide, formation: FormationType) => void;
  onSelectTool: (tool: ToolType) => void;
  onToggleSpotlight: () => void;
  onClearDrawings: () => void;
  onAddDrawing: (drawing: any) => void;
  onAddKeyframe: () => void;
  onSelectFrame: (index: number) => void;
  onTogglePlay: () => void;
  onResetAnimation: () => void;
  onSwitchToTV: () => void;
  onQuickPreset: (action: 'high_press' | 'low_block' | 'compact') => void;
  onSetTeamVisibility: (visibility: 'both' | 'home' | 'away') => void;
  onSwitchSides: () => void;
  onSwapColors: () => void;
}

export const RemoteController: React.FC<RemoteControllerProps> = ({
  boardState,
  status,
  roomId,
  onMovePlayer,
  onMoveBall,
  onSelectPlayer,
  onSetFormation,
  onSelectTool,
  onToggleSpotlight,
  onClearDrawings,
  onAddDrawing,
  onAddKeyframe,
  onSelectFrame,
  onTogglePlay,
  onResetAnimation,
  onSwitchToTV,
  onQuickPreset,
  onSetTeamVisibility,
  onSwitchSides,
  onSwapColors,
}) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'formations' | 'tools' | 'animation'>('pitch');

  const selectedPlayer = boardState.players.find((p) => p.id === boardState.selectedPlayerId);

  // Trigger haptic feedback if mobile device supports it
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-2 sm:p-4 max-w-lg mx-auto select-none">
      {/* 1. Header with Connection & Status */}
      <header className="flex items-center justify-between py-2 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio size={16} className="animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
              BOARD CONTROLLER
            </div>
            <div className="text-xs font-bold text-white font-mono">
              ROOM #{roomId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              status === 'connected'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {status === 'connected' ? 'TV Sync Live' : 'Connecting...'}
          </span>

          <button
            onClick={onSwitchToTV}
            className="p-1.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:text-white"
            title="Switch to TV View"
          >
            <Tv size={16} />
          </button>
        </div>
      </header>

      {/* 2. Mini Touch Pitch Pad (Always visible or primary deck) */}
      <div className="mb-2">
        <MiniPitchPad
          boardState={boardState}
          onMovePlayer={(id, x, y) => {
            triggerHaptic();
            onMovePlayer(id, x, y);
          }}
          onMoveBall={(x, y) => {
            triggerHaptic();
            onMoveBall(x, y);
          }}
          onSelectPlayer={(p) => {
            triggerHaptic();
            onSelectPlayer(p);
          }}
          onAddDrawing={(d) => {
            triggerHaptic();
            onAddDrawing(d);
          }}
        />
      </div>

      {/* 2.5 Team Visibility Filter & Switch Sides Button */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex-1 flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => {
              triggerHaptic();
              onSetTeamVisibility('both');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              boardState.teamVisibility === 'both'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Both (22)
          </button>
          <button
            onClick={() => {
              triggerHaptic();
              onSetTeamVisibility('home');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              boardState.teamVisibility === 'home'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-cyan-400 hover:text-white'
            }`}
          >
            {boardState.homeTeamName || 'Home'}
          </button>
          <button
            onClick={() => {
              triggerHaptic();
              onSetTeamVisibility('away');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              boardState.teamVisibility === 'away'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'text-rose-400 hover:text-white'
            }`}
          >
            {boardState.awayTeamName || 'Away'}
          </button>
        </div>

        <button
          onClick={() => {
            triggerHaptic();
            onSwitchSides();
          }}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
          title="Switch Sides (Flip Home & Away)"
        >
          <span className="text-[10px]">Flip</span>
        </button>
      </div>

      {/* 3. Selected Player Quick Badge */}
      {selectedPlayer && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                selectedPlayer.team === 'home' ? 'bg-cyan-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}
            >
              {selectedPlayer.number}
            </span>
            <div>
              <div className="text-xs font-bold text-white">
                {selectedPlayer.role} {selectedPlayer.name}
              </div>
              <div className="text-[10px] text-slate-400">
                {selectedPlayer.team === 'home' ? 'Home' : 'Away'} • X: {selectedPlayer.x}% Y: {selectedPlayer.y}%
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic();
              onToggleSpotlight();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              selectedPlayer.isSpotlight
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-amber-400 border-amber-400/40'
            }`}
          >
            <Sparkles size={14} />
            <span>{selectedPlayer.isSpotlight ? 'Spotlight ON' : 'Spotlight'}</span>
          </button>
        </div>
      )}

      {/* 4. Tab Navigation Bar */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-3">
        <button
          onClick={() => setActiveTab('formations')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'formations'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>Formations</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'tools'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Analysis Tools</span>
        </button>

        <button
          onClick={() => setActiveTab('animation')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'animation'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play size={14} />
          <span>Replay & Motion</span>
        </button>
      </div>

      {/* 5. Tab Content Panes */}
      <div className="flex-1 overflow-y-auto pb-4">
        {activeTab === 'formations' && (
          <FormationPicker
            currentHomeFormation={boardState.homeFormation}
            currentAwayFormation={boardState.awayFormation}
            homeColor={boardState.homeColor}
            awayColor={boardState.awayColor}
            homeTeamName={boardState.homeTeamName}
            awayTeamName={boardState.awayTeamName}
            onSetFormation={(team, fmt) => {
              triggerHaptic();
              onSetFormation(team, fmt);
            }}
            onQuickPreset={(action) => {
              triggerHaptic();
              onQuickPreset(action);
            }}
            onSwapColors={() => {
              triggerHaptic();
              onSwapColors();
            }}
            onSwitchSides={() => {
              triggerHaptic();
              onSwitchSides();
            }}
          />
        )}

        {activeTab === 'tools' && (
          <ToolPalette
            activeTool={boardState.activeTool}
            hasSelectedPlayer={!!selectedPlayer}
            onSelectTool={(tool) => {
              triggerHaptic();
              onSelectTool(tool);
            }}
            onClearAll={() => {
              triggerHaptic();
              onClearDrawings();
            }}
            onToggleSpotlight={() => {
              triggerHaptic();
              onToggleSpotlight();
            }}
            isSpotlightActive={!!selectedPlayer?.isSpotlight}
          />
        )}

        {activeTab === 'animation' && (
          <div className="space-y-3">
            <BottomTimeline
              keyframes={boardState.keyframes}
              currentFrameIndex={boardState.currentFrameIndex}
              isPlaying={boardState.isPlayingAnimation}
              onAddKeyframe={() => {
                triggerHaptic();
                onAddKeyframe();
              }}
              onSelectFrame={(idx) => {
                triggerHaptic();
                onSelectFrame(idx);
              }}
              onTogglePlay={() => {
                triggerHaptic();
                onTogglePlay();
              }}
              onReset={() => {
                triggerHaptic();
                onResetAnimation();
              }}
            />
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
              💡 <span className="font-bold text-white">Pro Tip:</span> Move your players to set up Phase 1, tap <span className="text-emerald-400 font-semibold">+ Add Frame</span>, drag them to their attacking run/pass positions for Phase 2, then tap <span className="text-cyan-400 font-semibold">PLAY REPLAY</span> to watch the movement play live on the TV!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
