import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoardState,
  FormationType,
  Player,
  TeamSide,
  ToolType,
  DrawingElement,
  TacticalFrame,
  SyncMessage,
  Position,
} from './types/tactics';
import { FORMATION_PRESETS, getInitialTeamPlayers } from './constants/formations';
import { syncService, ConnectionStatus } from './services/peerSync';
import { PitchField } from './components/Pitch/PitchField';
import { PlayerToken } from './components/Pitch/PlayerToken';
import { BallToken } from './components/Pitch/BallToken';
import { TacticalDrawingLayer } from './components/Pitch/TacticalDrawingLayer';
import { SpotlightLayer } from './components/Pitch/SpotlightLayer';
import { TopNav } from './components/Toolbar/TopNav';
import { SideToolbox } from './components/Toolbar/SideToolbox';
import { BottomTimeline } from './components/Toolbar/BottomTimeline';
import { RemoteController } from './components/Remote/RemoteController';
import { TVDisplay } from './components/TV/TVDisplay';
import { PairingModal } from './components/TV/PairingModal';
import { PITCH_CONFIG, clientToPitchCoords } from './constants/pitch';
import { Eye, Minimize2 } from 'lucide-react';

export function App() {
  // 1. URL Parameter Parsing
  const queryParams = new URLSearchParams(window.location.search);
  const initialRoom = queryParams.get('room') || Math.floor(1000 + Math.random() * 9000).toString();
  const initialMode = (queryParams.get('mode') as 'standalone' | 'tv' | 'remote') || 'standalone';

  const [roomId, setRoomId] = useState<string>(initialRoom);
  const [appMode, setAppMode] = useState<'standalone' | 'tv' | 'remote'>(initialMode);
  const [isPairingOpen, setIsPairingOpen] = useState<boolean>(false);
  const [cleanAirPlayMode, setCleanAirPlayMode] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<ConnectionStatus>('disconnected');

  // Pitch authoritative SVG ref for 100% accurate mouse/pointer mapping
  const pitchSvgRef = useRef<SVGSVGElement | null>(null);

  // 2. Initial Tactical Board State
  const initialHomePlayers = getInitialTeamPlayers('home', '4-3-3');
  const initialAwayPlayers = getInitialTeamPlayers('away', '4-2-3-1');

  const [boardState, setBoardState] = useState<BoardState>({
    players: [...initialHomePlayers, ...initialAwayPlayers],
    ball: { x: 50, y: 50 },
    drawings: [],
    selectedPlayerId: null,
    activeTool: 'select',
    homeFormation: '4-3-3',
    awayFormation: '4-2-3-1',
    homeColor: '#00c3ff', // Sky Blue
    awayColor: '#ff3366', // Crimson Red
    homeTeamName: 'HOME',
    awayTeamName: 'AWAY',
    showTacticalChannels: true,
    pitchView: '2d',
    teamVisibility: 'both',
    keyframes: [
      {
        id: 'frame_initial',
        name: 'Phase 1: Setup',
        timestamp: Date.now(),
        players: [...initialHomePlayers, ...initialAwayPlayers],
        ball: { x: 50, y: 50 },
        drawings: [],
      },
    ],
    currentFrameIndex: 0,
    isPlayingAnimation: false,
  });

  // Animation timer ref
  const animationTimerRef = useRef<number | null>(null);

  // Drag tracking for main pitch
  const [activeDrag, setActiveDrag] = useState<{
    type: 'player' | 'ball';
    id?: string;
  } | null>(null);

  // 3. Initialize Realtime Sync
  useEffect(() => {
    const isHost = appMode !== 'remote';
    syncService.init(roomId, isHost);

    const unsubStatus = syncService.onStatusChange((status) => {
      setSyncStatus(status);
    });

    const unsubMsg = syncService.onMessage((msg: SyncMessage) => {
      handleIncomingSync(msg);
    });

    return () => {
      unsubStatus();
      unsubMsg();
      syncService.destroy();
    };
  }, [roomId, appMode]);

  // Handle Incoming Remote Messages
  const handleIncomingSync = useCallback((msg: SyncMessage) => {
    switch (msg.type) {
      case 'SYNC_FULL_STATE':
        setBoardState((prev) => ({ ...prev, ...msg.payload }));
        break;

      case 'MOVE_PLAYER':
        setBoardState((prev) => ({
          ...prev,
          players: prev.players.map((p) =>
            p.id === msg.payload.id ? { ...p, x: msg.payload.x, y: msg.payload.y } : p
          ),
        }));
        break;

      case 'MOVE_BALL':
        setBoardState((prev) => ({
          ...prev,
          ball: { ...prev.ball, x: msg.payload.x, y: msg.payload.y },
        }));
        break;

      case 'SET_FORMATION':
        executeFormationChange(msg.payload.team, msg.payload.formation);
        break;

      case 'TOGGLE_SPOTLIGHT':
        setBoardState((prev) => ({
          ...prev,
          players: prev.players.map((p) =>
            p.id === msg.payload.playerId ? { ...p, isSpotlight: !p.isSpotlight } : p
          ),
        }));
        break;

      case 'ADD_DRAWING':
        setBoardState((prev) => ({
          ...prev,
          drawings: [...prev.drawings, msg.payload],
        }));
        break;

      case 'CLEAR_DRAWINGS':
        setBoardState((prev) => ({
          ...prev,
          drawings: [],
        }));
        break;

      case 'TRIGGER_ANIMATION':
        if (msg.payload.play) {
          startAnimationPlayback();
        } else {
          stopAnimationPlayback();
        }
        break;

      case 'TOGGLE_VIEW':
        setBoardState((prev) => ({ ...prev, pitchView: msg.payload }));
        break;

      case 'TOGGLE_CHANNELS':
        setBoardState((prev) => ({ ...prev, showTacticalChannels: msg.payload }));
        break;

      case 'SET_TEAM_VISIBILITY':
        setBoardState((prev) => ({ ...prev, teamVisibility: msg.payload }));
        break;

      case 'SWITCH_SIDES':
        executeSwitchSides();
        break;

      case 'SWAP_COLORS':
        executeSwapColors();
        break;

      case 'SET_TEAM_NAME':
        setBoardState((prev) => ({
          ...prev,
          homeTeamName: msg.payload.team === 'home' ? msg.payload.name : prev.homeTeamName,
          awayTeamName: msg.payload.team === 'away' ? msg.payload.name : prev.awayTeamName,
        }));
        break;
    }
  }, []);

  // 4. Tactical Actions & Broadcasters
  const handleMovePlayer = (id: string, x: number, y: number) => {
    setBoardState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, x, y } : p)),
    }));
    syncService.sendMessage({
      type: 'MOVE_PLAYER',
      payload: { id, x, y },
    });
  };

  const handleMoveBall = (x: number, y: number) => {
    setBoardState((prev) => ({
      ...prev,
      ball: { ...prev.ball, x, y },
    }));
    syncService.sendMessage({
      type: 'MOVE_BALL',
      payload: { x, y },
    });
  };

  const executeFormationChange = (team: TeamSide, formation: FormationType) => {
    const slots = FORMATION_PRESETS[formation];
    setBoardState((prev) => {
      const updatedPlayers = prev.players.map((player) => {
        if (player.team !== team) return player;
        const index = parseInt(player.id.split('_')[1], 10) - 1;
        const slot = slots[index] || slots[0];
        const isHome = team === 'home';
        const targetX = isHome ? slot.x : 100 - slot.x;
        const targetY = isHome ? slot.y : 100 - slot.y;
        return {
          ...player,
          role: slot.role,
          x: Math.round(targetX * 10) / 10,
          y: Math.round(targetY * 10) / 10,
        };
      });

      return {
        ...prev,
        players: updatedPlayers,
        homeFormation: team === 'home' ? formation : prev.homeFormation,
        awayFormation: team === 'away' ? formation : prev.awayFormation,
      };
    });
  };

  const handleSetFormation = (team: TeamSide, formation: FormationType) => {
    executeFormationChange(team, formation);
    syncService.sendMessage({
      type: 'SET_FORMATION',
      payload: { team, formation },
    });
  };

  const handleToggleSpotlight = () => {
    if (!boardState.selectedPlayerId) return;
    const targetId = boardState.selectedPlayerId;
    setBoardState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === targetId ? { ...p, isSpotlight: !p.isSpotlight } : p
      ),
    }));
    syncService.sendMessage({
      type: 'TOGGLE_SPOTLIGHT',
      payload: { playerId: targetId },
    });
  };

  const handleAddDrawing = (drawing: DrawingElement) => {
    setBoardState((prev) => ({
      ...prev,
      drawings: [...prev.drawings, drawing],
    }));
    syncService.sendMessage({
      type: 'ADD_DRAWING',
      payload: drawing,
    });
  };

  const handleClearDrawings = () => {
    setBoardState((prev) => ({
      ...prev,
      drawings: [],
    }));
    syncService.sendMessage({
      type: 'CLEAR_DRAWINGS',
    });
  };

  const handleQuickPreset = (action: 'high_press' | 'low_block' | 'compact') => {
    setBoardState((prev) => {
      const shiftX = action === 'high_press' ? 8 : action === 'low_block' ? -8 : 0;
      const updatedPlayers = prev.players.map((p) => {
        if (p.role === 'GK') return p;
        const dir = p.team === 'home' ? 1 : -1;
        const newX = Math.max(8, Math.min(92, p.x + shiftX * dir));
        return { ...p, x: Math.round(newX * 10) / 10 };
      });
      return { ...prev, players: updatedPlayers };
    });
  };

  const handleSetTeamVisibility = (visibility: 'both' | 'home' | 'away') => {
    setBoardState((prev) => ({ ...prev, teamVisibility: visibility }));
    syncService.sendMessage({
      type: 'SET_TEAM_VISIBILITY',
      payload: visibility,
    });
  };

  const executeSwitchSides = () => {
    setBoardState((prev) => {
      const flippedPlayers = prev.players.map((p) => ({
        ...p,
        x: Math.round((100 - p.x) * 10) / 10,
      }));
      const flippedBall = {
        ...prev.ball,
        x: Math.round((100 - prev.ball.x) * 10) / 10,
      };
      return {
        ...prev,
        players: flippedPlayers,
        ball: flippedBall,
      };
    });
  };

  const handleSwitchSides = () => {
    executeSwitchSides();
    syncService.sendMessage({ type: 'SWITCH_SIDES' });
  };

  const executeSwapColors = () => {
    setBoardState((prev) => ({
      ...prev,
      homeColor: prev.awayColor,
      awayColor: prev.homeColor,
    }));
  };

  const handleSwapColors = () => {
    executeSwapColors();
    syncService.sendMessage({ type: 'SWAP_COLORS' });
  };

  const handleUpdateTeamName = (team: TeamSide, name: string) => {
    setBoardState((prev) => ({
      ...prev,
      homeTeamName: team === 'home' ? name : prev.homeTeamName,
      awayTeamName: team === 'away' ? name : prev.awayTeamName,
    }));
    syncService.sendMessage({
      type: 'SET_TEAM_NAME',
      payload: { team, name },
    });
  };

  // 5. Tactical Animation Engine
  const handleAddKeyframe = () => {
    setBoardState((prev) => {
      const newFrame: TacticalFrame = {
        id: `frame_${Date.now()}`,
        name: `Phase ${prev.keyframes.length + 1}`,
        timestamp: Date.now(),
        players: JSON.parse(JSON.stringify(prev.players)),
        ball: { ...prev.ball },
        drawings: [...prev.drawings],
      };
      return {
        ...prev,
        keyframes: [...prev.keyframes, newFrame],
        currentFrameIndex: prev.keyframes.length,
      };
    });
  };

  const handleSelectFrame = (index: number) => {
    setBoardState((prev) => {
      const targetFrame = prev.keyframes[index];
      if (!targetFrame) return prev;
      return {
        ...prev,
        currentFrameIndex: index,
        players: JSON.parse(JSON.stringify(targetFrame.players)),
        ball: { ...targetFrame.ball },
        drawings: [...targetFrame.drawings],
      };
    });
  };

  const startAnimationPlayback = () => {
    if (boardState.keyframes.length < 2) return;
    setBoardState((prev) => ({ ...prev, isPlayingAnimation: true }));

    let currentStep = 0;
    const totalFrames = boardState.keyframes.length;

    if (animationTimerRef.current) clearInterval(animationTimerRef.current);

    animationTimerRef.current = window.setInterval(() => {
      currentStep = (currentStep + 1) % totalFrames;
      handleSelectFrame(currentStep);
    }, 1800);
  };

  const stopAnimationPlayback = () => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    setBoardState((prev) => ({ ...prev, isPlayingAnimation: false }));
  };

  const handleTogglePlay = () => {
    const nextPlaying = !boardState.isPlayingAnimation;
    if (nextPlaying) {
      startAnimationPlayback();
    } else {
      stopAnimationPlayback();
    }
    syncService.sendMessage({
      type: 'TRIGGER_ANIMATION',
      payload: { play: nextPlaying },
    });
  };

  // 6. Global Pointer Drag Listener (Rock-solid mouse & touch tracking with zero cursor escape)
  useEffect(() => {
    if (!activeDrag) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!pitchSvgRef.current) return;
      const coords = clientToPitchCoords(pitchSvgRef.current, e.clientX, e.clientY);
      if (activeDrag.type === 'player' && activeDrag.id) {
        handleMovePlayer(activeDrag.id, coords.x, coords.y);
      } else if (activeDrag.type === 'ball') {
        handleMoveBall(coords.x, coords.y);
      }
    };

    const onPointerUp = () => {
      setActiveDrag(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [activeDrag]);

  // RENDER VIEW MODES
  // Mode 1: Mobile Touch Remote Controller
  if (appMode === 'remote') {
    return (
      <RemoteController
        boardState={boardState}
        status={syncStatus}
        roomId={roomId}
        onMovePlayer={handleMovePlayer}
        onMoveBall={handleMoveBall}
        onSelectPlayer={(p) => setBoardState((prev) => ({ ...prev, selectedPlayerId: p.id }))}
        onSetFormation={handleSetFormation}
        onSelectTool={(tool) => setBoardState((prev) => ({ ...prev, activeTool: tool }))}
        onToggleSpotlight={handleToggleSpotlight}
        onClearDrawings={handleClearDrawings}
        onAddDrawing={handleAddDrawing}
        onAddKeyframe={handleAddKeyframe}
        onSelectFrame={handleSelectFrame}
        onTogglePlay={handleTogglePlay}
        onResetAnimation={() => handleSelectFrame(0)}
        onSwitchToTV={() => setAppMode('tv')}
        onQuickPreset={handleQuickPreset}
        onSetTeamVisibility={handleSetTeamVisibility}
        onSwitchSides={handleSwitchSides}
        onSwapColors={handleSwapColors}
      />
    );
  }

  // Mode 2: TV Broadcast Presentation Display
  if (appMode === 'tv') {
    return (
      <>
        <TVDisplay
          boardState={boardState}
          status={syncStatus}
          roomId={roomId}
          onOpenPairing={() => setIsPairingOpen(true)}
          onToggleChannels={() =>
            setBoardState((prev) => ({ ...prev, showTacticalChannels: !prev.showTacticalChannels }))
          }
          onTogglePitchView={() =>
            setBoardState((prev) => ({
              ...prev,
              pitchView: prev.pitchView === '2d' ? 'perspective' : '2d',
            }))
          }
          onSelectPlayer={(p) => setBoardState((prev) => ({ ...prev, selectedPlayerId: p.id }))}
        />

        <PairingModal
          roomId={roomId}
          status={syncStatus}
          isOpen={isPairingOpen}
          onClose={() => setIsPairingOpen(false)}
        />
      </>
    );
  }

  // Mode 3: Standalone Interactive Board (Desktop / Laptop / Tablet & Clean AirPlay mode)
  const visiblePlayers = boardState.players.filter((p) => {
    if (boardState.teamVisibility === 'both') return true;
    return p.team === boardState.teamVisibility;
  });

  return (
    <div className="relative w-screen h-screen bg-[#070b14] overflow-hidden flex flex-col select-none">
      {/* Top Header (Hides in clean AirPlay mode) */}
      {!cleanAirPlayMode && (
        <TopNav
          appMode={appMode}
          onSetMode={setAppMode}
          showChannels={boardState.showTacticalChannels}
          onToggleChannels={() =>
            setBoardState((prev) => ({
              ...prev,
              showTacticalChannels: !prev.showTacticalChannels,
            }))
          }
          pitchView={boardState.pitchView}
          onTogglePitchView={() =>
            setBoardState((prev) => ({
              ...prev,
              pitchView: prev.pitchView === '2d' ? 'perspective' : '2d',
            }))
          }
          onOpenPairing={() => setIsPairingOpen(true)}
          onToggleCleanMode={() => setCleanAirPlayMode(true)}
          homeTeamName={boardState.homeTeamName}
          awayTeamName={boardState.awayTeamName}
          teamVisibility={boardState.teamVisibility}
          onSetTeamVisibility={handleSetTeamVisibility}
          onSwitchSides={handleSwitchSides}
          onUpdateTeamName={handleUpdateTeamName}
        />
      )}

      {/* Clean AirPlay Restore Floating Trigger */}
      {cleanAirPlayMode && (
        <button
          onClick={() => setCleanAirPlayMode(false)}
          className="fixed top-4 right-4 z-50 p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-full border border-slate-700 shadow-2xl flex items-center gap-1.5 text-xs transition-all"
        >
          <Minimize2 size={16} />
          <span>Exit Clean Mode</span>
        </button>
      )}

      {/* Main Pitch Field */}
      <main className="flex-1 w-full h-full flex items-center justify-center p-2">
        <PitchField
          showTacticalChannels={boardState.showTacticalChannels}
          viewMode={boardState.pitchView}
          svgRef={pitchSvgRef}
        >
          {/* Spotlight Mask */}
          <SpotlightLayer players={visiblePlayers} />

          {/* Tactical Drawings */}
          <TacticalDrawingLayer drawings={boardState.drawings} players={visiblePlayers} />

          {/* Football */}
          <BallToken
            ball={boardState.ball}
            isInteractive={true}
            onDragStart={() => setActiveDrag({ type: 'ball' })}
          />

          {/* Visible Players */}
          {visiblePlayers.map((player) => (
            <PlayerToken
              key={player.id}
              player={player}
              teamColor={player.team === 'home' ? boardState.homeColor : boardState.awayColor}
              isSelected={boardState.selectedPlayerId === player.id}
              isInteractive={true}
              onSelect={(p) => setBoardState((prev) => ({ ...prev, selectedPlayerId: p.id }))}
              onDragStart={(p) => setActiveDrag({ type: 'player', id: p.id })}
            />
          ))}
        </PitchField>
      </main>

      {/* Floating Side Toolbox (Hides in clean AirPlay mode) */}
      {!cleanAirPlayMode && (
        <SideToolbox
          boardState={boardState}
          onSetFormation={handleSetFormation}
          onSelectTool={(tool) => setBoardState((prev) => ({ ...prev, activeTool: tool }))}
          onToggleSpotlight={handleToggleSpotlight}
          onClearDrawings={handleClearDrawings}
          onQuickPreset={handleQuickPreset}
          onSetTeamVisibility={handleSetTeamVisibility}
          onSwitchSides={handleSwitchSides}
          onSwapColors={handleSwapColors}
        />
      )}

      {/* Bottom Keyframe Animation Bar (Hides in clean AirPlay mode) */}
      {!cleanAirPlayMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4">
          <BottomTimeline
            keyframes={boardState.keyframes}
            currentFrameIndex={boardState.currentFrameIndex}
            isPlaying={boardState.isPlayingAnimation}
            onAddKeyframe={handleAddKeyframe}
            onSelectFrame={handleSelectFrame}
            onTogglePlay={handleTogglePlay}
            onReset={() => handleSelectFrame(0)}
          />
        </div>
      )}

      {/* QR Code Pairing Modal */}
      <PairingModal
        roomId={roomId}
        status={syncStatus}
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
      />
    </div>
  );
}
