import React, { useRef, useState } from 'react';
import { BoardState, Player, Position } from '../../types/tactics';
import { PITCH_CONFIG, clientToPitchCoords } from '../../constants/pitch';
import { PlayerToken } from '../Pitch/PlayerToken';
import { BallToken } from '../Pitch/BallToken';
import { TacticalDrawingLayer } from '../Pitch/TacticalDrawingLayer';
import { SpotlightLayer } from '../Pitch/SpotlightLayer';

interface MiniPitchPadProps {
  boardState: BoardState;
  onMovePlayer: (id: string, x: number, y: number) => void;
  onMoveBall: (x: number, y: number) => void;
  onSelectPlayer: (player: Player) => void;
  onAddDrawing?: (drawing: any) => void;
}

export const MiniPitchPad: React.FC<MiniPitchPadProps> = ({
  boardState,
  onMovePlayer,
  onMoveBall,
  onSelectPlayer,
  onAddDrawing,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeDrag, setActiveDrag] = useState<{
    type: 'player' | 'ball';
    id?: string;
  } | null>(null);

  // Drawing state for tools (curve_run, arrow_pass, etc.)
  const [drawStart, setDrawStart] = useState<Position | null>(null);
  const [penPoints, setPenPoints] = useState<Position[]>([]);

  const { width, height, padding } = PITCH_CONFIG;
  const pitchWidth = width - padding * 2;
  const pitchHeight = height - padding * 2;

  // Convert touch/pointer client coordinates into Pitch Percentage (0-100)
  const getPitchCoords = (e: React.PointerEvent): Position | null => {
    if (!svgRef.current) return null;
    return clientToPitchCoords(svgRef.current, e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (boardState.activeTool === 'pen') {
      const coords = getPitchCoords(e);
      if (coords) setPenPoints([coords]);
    } else if (
      boardState.activeTool === 'curve_run' ||
      boardState.activeTool === 'arrow_pass' ||
      boardState.activeTool === 'arrow_run'
    ) {
      const coords = getPitchCoords(e);
      if (coords) setDrawStart(coords);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const coords = getPitchCoords(e);
    if (!coords) return;

    // 1. Move Player
    if (activeDrag && activeDrag.type === 'player' && activeDrag.id) {
      onMovePlayer(activeDrag.id, coords.x, coords.y);
    }

    // 2. Move Ball
    if (activeDrag && activeDrag.type === 'ball') {
      onMoveBall(coords.x, coords.y);
    }

    // 3. Freehand Pen Draw
    if (boardState.activeTool === 'pen' && penPoints.length > 0) {
      setPenPoints((prev) => [...prev, coords]);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // Complete Tool Action
    if (drawStart && onAddDrawing) {
      const coords = getPitchCoords(e);
      if (coords) {
        onAddDrawing({
          id: `draw_${Date.now()}`,
          type: boardState.activeTool as any,
          start: drawStart,
          end: coords,
          color: boardState.activeTool === 'arrow_pass' ? '#facc15' : '#00f0ff',
        });
      }
      setDrawStart(null);
    }

    if (boardState.activeTool === 'pen' && penPoints.length > 1 && onAddDrawing) {
      onAddDrawing({
        id: `pen_${Date.now()}`,
        type: 'pen',
        points: penPoints,
        color: '#facc15',
        width: 3,
      });
      setPenPoints([]);
    }

    setActiveDrag(null);
  };

  return (
    <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl touch-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full block"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Simple crisp pitch backdrop for mobile responsiveness */}
        <rect x="0" y="0" width={width} height={height} fill="#0d3b1f" />

        {/* Pitch boundary */}
        <rect
          x={padding}
          y={padding}
          width={pitchWidth}
          height={pitchHeight}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="3"
        />

        {/* Halfway line & Center circle */}
        <line
          x1={padding + pitchWidth / 2}
          y1={padding}
          x2={padding + pitchWidth / 2}
          y2={padding + pitchHeight}
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="3"
        />
        <circle
          cx={padding + pitchWidth / 2}
          cy={padding + pitchHeight / 2}
          r={PITCH_CONFIG.centerCircleRadius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="3"
        />

        {/* Penalty boxes */}
        <rect
          x={padding}
          y={padding + (pitchHeight - PITCH_CONFIG.penaltyBoxHeight) / 2}
          width={PITCH_CONFIG.penaltyBoxWidth}
          height={PITCH_CONFIG.penaltyBoxHeight}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="3"
        />
        <rect
          x={padding + pitchWidth - PITCH_CONFIG.penaltyBoxWidth}
          y={padding + (pitchHeight - PITCH_CONFIG.penaltyBoxHeight) / 2}
          width={PITCH_CONFIG.penaltyBoxWidth}
          height={PITCH_CONFIG.penaltyBoxHeight}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="3"
        />

        {/* Filtered visible players */}
        {(() => {
          const visiblePlayers = boardState.players.filter((p) => {
            if (boardState.teamVisibility === 'both') return true;
            return p.team === boardState.teamVisibility;
          });

          return (
            <>
              {/* Spotlights */}
              <SpotlightLayer players={visiblePlayers} />

              {/* Tactical drawings */}
              <TacticalDrawingLayer drawings={boardState.drawings} players={visiblePlayers} />

              {/* Active In-Progress Pen Stroke */}
              {penPoints.length > 1 && (
                <path
                  d={penPoints.reduce((acc, pt, idx) => {
                    const px = padding + (pt.x / 100) * pitchWidth;
                    const py = padding + (pt.y / 100) * pitchHeight;
                    return idx === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`;
                  }, '')}
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="3"
                />
              )}

              {/* Ball */}
              <BallToken
                ball={boardState.ball}
                isInteractive={true}
                onDragStart={() => setActiveDrag({ type: 'ball' })}
              />

              {/* Players */}
              {visiblePlayers.map((player) => (
                <PlayerToken
                  key={player.id}
                  player={player}
                  teamColor={player.team === 'home' ? boardState.homeColor : boardState.awayColor}
                  isSelected={boardState.selectedPlayerId === player.id}
                  isInteractive={true}
                  onSelect={onSelectPlayer}
                  onDragStart={(p) => setActiveDrag({ type: 'player', id: p.id })}
                />
              ))}
            </>
          );
        })()}
      </svg>

      {/* Touch helper label */}
      <div className="absolute top-2 left-3 pointer-events-none bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 border border-slate-800">
        TOUCH TRACKPAD
      </div>
    </div>
  );
};
