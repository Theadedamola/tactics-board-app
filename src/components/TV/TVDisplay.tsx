import React from 'react';
import { BoardState, Player } from '../../types/tactics';
import { PitchField } from '../Pitch/PitchField';
import { PlayerToken } from '../Pitch/PlayerToken';
import { BallToken } from '../Pitch/BallToken';
import { TacticalDrawingLayer } from '../Pitch/TacticalDrawingLayer';
import { SpotlightLayer } from '../Pitch/SpotlightLayer';
import { QrCode, Compass, Grid, Maximize2, Radio } from 'lucide-react';
import { ConnectionStatus } from '../../services/peerSync';

interface TVDisplayProps {
  boardState: BoardState;
  status: ConnectionStatus;
  roomId: string;
  onOpenPairing: () => void;
  onToggleChannels: () => void;
  onTogglePitchView: () => void;
  onSelectPlayer: (player: Player) => void;
  isInteractive?: boolean;
  onMovePlayer?: (id: string, x: number, y: number) => void;
  onMoveBall?: (x: number, y: number) => void;
}

export const TVDisplay: React.FC<TVDisplayProps> = ({
  boardState,
  status,
  roomId,
  onOpenPairing,
  onToggleChannels,
  onTogglePitchView,
  onSelectPlayer,
  isInteractive = false,
  onMovePlayer,
  onMoveBall,
}) => {
  const visiblePlayers = boardState.players.filter((p) => {
    if (boardState.teamVisibility === 'both') return true;
    return p.team === boardState.teamVisibility;
  });

  return (
    <div className="relative w-screen h-screen bg-[#070b14] overflow-hidden flex flex-col items-center justify-center select-none">
      {/* 1. Sleek Minimal Broadcast Header Bar */}
      <header className="absolute top-4 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
        {/* Header Branding */}
        <div className="flex items-center gap-3 pointer-events-auto bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800/80 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-white font-black tracking-wider text-base">
              BOARD
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700" />

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-cyan-400">{boardState.homeTeamName || 'HOME'}</span>
            <span className="text-slate-500 font-normal">vs</span>
            <span className="text-rose-400">{boardState.awayTeamName || 'AWAY'}</span>
          </div>

          {boardState.teamVisibility !== 'both' && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
              boardState.teamVisibility === 'home'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}>
              {boardState.teamVisibility === 'home' ? 'HOME ONLY' : 'AWAY ONLY'}
            </span>
          )}
        </div>

        {/* Room Pairing & Status Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onOpenPairing}
            className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800/80 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-500 transition-all shadow-xl group"
          >
            <Radio size={14} className={status === 'connected' ? 'text-emerald-400 animate-pulse' : 'text-amber-400'} />
            <span>ROOM: <strong className="text-cyan-400 font-mono tracking-wider">{roomId}</strong></span>
            <QrCode size={15} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>
      </header>

      {/* 2. Main High-Definition Pitch Canvas */}
      <div className="w-full h-full flex items-center justify-center">
        <PitchField
          showTacticalChannels={boardState.showTacticalChannels}
          viewMode={boardState.pitchView}
        >
          {/* Spotlight floodlight mask */}
          <SpotlightLayer players={visiblePlayers} />

          {/* Tactical Drawings, Arrows, Pass Lines, Compactness */}
          <TacticalDrawingLayer drawings={boardState.drawings} players={visiblePlayers} />

          {/* Ball */}
          <BallToken
            ball={boardState.ball}
            isInteractive={isInteractive}
            onDragStart={() => {}}
          />

          {/* Visible Players */}
          {visiblePlayers.map((player) => (
            <PlayerToken
              key={player.id}
              player={player}
              teamColor={player.team === 'home' ? boardState.homeColor : boardState.awayColor}
              isSelected={boardState.selectedPlayerId === player.id}
              isInteractive={isInteractive}
              onSelect={onSelectPlayer}
            />
          ))}
        </PitchField>
      </div>

      {/* 3. Discreet Floating TV Action Controls in Bottom Right */}
      <div className="absolute bottom-5 right-6 flex items-center gap-2 z-30">
        <button
          onClick={onToggleChannels}
          className={`p-3 rounded-2xl backdrop-blur-md border transition-all shadow-xl ${
            boardState.showTacticalChannels
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Tactical Corridors & Half-Spaces"
        >
          <Grid size={18} />
        </button>

        <button
          onClick={onTogglePitchView}
          className={`p-3 rounded-2xl backdrop-blur-md border transition-all shadow-xl ${
            boardState.pitchView === 'perspective'
              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-400'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle 2.5D Stadium Broadcast Perspective"
        >
          <Compass size={18} />
        </button>
      </div>
    </div>
  );
};
