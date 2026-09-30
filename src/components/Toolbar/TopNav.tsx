import React from 'react';
import { Tv, Smartphone, Grid, Compass, QrCode, Maximize2, Layers, Users, ArrowLeftRight } from 'lucide-react';
import { TeamSide } from '../../types/tactics';

interface TopNavProps {
  appMode: 'standalone' | 'tv' | 'remote';
  onSetMode: (mode: 'standalone' | 'tv' | 'remote') => void;
  showChannels: boolean;
  onToggleChannels: () => void;
  pitchView: '2d' | 'perspective';
  onTogglePitchView: () => void;
  onOpenPairing: () => void;
  onToggleCleanMode: () => void;
  homeTeamName: string;
  awayTeamName: string;
  teamVisibility: 'both' | 'home' | 'away';
  onSetTeamVisibility: (visibility: 'both' | 'home' | 'away') => void;
  onSwitchSides: () => void;
  onUpdateTeamName: (team: TeamSide, name: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  appMode,
  onSetMode,
  showChannels,
  onToggleChannels,
  pitchView,
  onTogglePitchView,
  onOpenPairing,
  onToggleCleanMode,
  homeTeamName,
  awayTeamName,
  teamVisibility,
  onSetTeamVisibility,
  onSwitchSides,
  onUpdateTeamName,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 z-40">
      {/* Brand & Match Banner */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-black tracking-wider text-base sm:text-lg">
            BOARD
          </span>
        </div>

        {/* Editable Team Names & Switch Sides button */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <input
            type="text"
            value={homeTeamName}
            onChange={(e) => onUpdateTeamName('home', e.target.value)}
            className="w-24 bg-transparent text-center font-bold text-cyan-400 focus:outline-none focus:bg-slate-900 rounded px-1 transition-all"
            placeholder="Home"
            title="Click to edit Home team name"
          />
          <button
            onClick={onSwitchSides}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-all"
            title="Switch Sides (Flip Home & Away)"
          >
            <ArrowLeftRight size={13} />
          </button>
          <input
            type="text"
            value={awayTeamName}
            onChange={(e) => onUpdateTeamName('away', e.target.value)}
            className="w-24 bg-transparent text-center font-bold text-rose-400 focus:outline-none focus:bg-slate-900 rounded px-1 transition-all"
            placeholder="Away"
            title="Click to edit Away team name"
          />
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onSetMode('standalone')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            appMode === 'standalone'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={13} />
          <span className="hidden sm:inline">Board</span>
        </button>

        <button
          onClick={() => onSetMode('tv')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            appMode === 'tv'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv size={13} />
          <span>TV Display</span>
        </button>

        <button
          onClick={() => onSetMode('remote')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            appMode === 'remote'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone size={13} />
          <span>Mobile Deck</span>
        </button>
      </div>

      {/* Team Visibility Filter: Both | Home Only | Away Only */}
      <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onSetTeamVisibility('both')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            teamVisibility === 'both'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Show Both Teams (22 Players)"
        >
          <Users size={13} />
          <span>Both (22)</span>
        </button>

        <button
          onClick={() => onSetTeamVisibility('home')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            teamVisibility === 'home'
              ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
              : 'text-cyan-400 hover:text-white'
          }`}
          title="Show Home Team Only (11 Players)"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Home Only</span>
        </button>

        <button
          onClick={() => onSetTeamVisibility('away')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            teamVisibility === 'away'
              ? 'bg-rose-500 text-white font-extrabold shadow-md shadow-rose-500/20'
              : 'text-rose-400 hover:text-white'
          }`}
          title="Show Away Team Only (11 Players)"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Away Only</span>
        </button>
      </div>

      {/* View Options */}
      <div className="flex items-center gap-2">
        {/* Switch Sides */}
        <button
          onClick={onSwitchSides}
          className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
          title="Switch Pitch Halves (Flip Home and Away sides)"
        >
          <ArrowLeftRight size={15} className="text-cyan-400" />
          <span className="hidden lg:inline">Switch Sides</span>
        </button>

        {/* Tactical Channels (5 Corridors) */}
        <button
          onClick={onToggleChannels}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1 ${
            showChannels
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Toggle 5 Tactical Channels (Half-spaces)"
        >
          <Grid size={15} />
          <span className="hidden lg:inline">Channels</span>
        </button>

        {/* 2D / 2.5D Perspective */}
        <button
          onClick={onTogglePitchView}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1 ${
            pitchView === 'perspective'
              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-400'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Toggle 2.5D Stadium Perspective"
        >
          <Compass size={15} />
          <span className="hidden lg:inline">{pitchView === '2d' ? '2.5D Cam' : '2D Top'}</span>
        </button>

        {/* Connect Phone / QR Code */}
        <button
          onClick={onOpenPairing}
          className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 text-xs transition-all"
          title="Connect Phone as Remote"
        >
          <QrCode size={15} />
          <span className="hidden sm:inline">Pair Phone</span>
        </button>

        {/* Clean Presentation Mode (AirPlay) */}
        <button
          onClick={onToggleCleanMode}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-all"
          title="Clean AirPlay / Fullscreen Mode"
        >
          <Maximize2 size={15} />
        </button>
      </div>
    </header>
  );
};
