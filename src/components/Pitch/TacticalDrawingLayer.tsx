import React from 'react';
import { DrawingElement, Player } from '../../types/tactics';
import { PITCH_CONFIG } from '../../constants/pitch';

interface TacticalDrawingLayerProps {
  drawings: DrawingElement[];
  players: Player[];
}

export const TacticalDrawingLayer: React.FC<TacticalDrawingLayerProps> = ({
  drawings,
  players,
}) => {
  const { width, height, padding } = PITCH_CONFIG;
  const pitchWidth = width - padding * 2;
  const pitchHeight = height - padding * 2;

  const toPx = (pctX: number, pctY: number) => ({
    x: padding + (pctX / 100) * pitchWidth,
    y: padding + (pctY / 100) * pitchHeight,
  });

  return (
    <g id="tactical-drawing-layer">
      <defs>
        {/* Run Arrowhead */}
        <marker
          id="marker-run-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
        </marker>

        {/* Pass Arrowhead */}
        <marker
          id="marker-pass-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#facc15" />
        </marker>

        {/* Red / Press Arrowhead */}
        <marker
          id="marker-press-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#ff3366" />
        </marker>
      </defs>

      {drawings.map((draw) => {
        if (draw.type === 'curve_run' || draw.type === 'arrow_run' || draw.type === 'arrow_pass') {
          const s = toPx(draw.start.x, draw.start.y);
          const e = toPx(draw.end.x, draw.end.y);

          // Control point calculation for curved run
          let pathD = `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
          if (draw.type === 'curve_run') {
            const midX = (s.x + e.x) / 2;
            const midY = (s.y + e.y) / 2;
            // Perpendicular curve bend offset
            const dx = e.x - s.x;
            const dy = e.y - s.y;
            const bend = 35;
            const cx = draw.controlPoint ? toPx(draw.controlPoint.x, draw.controlPoint.y).x : midX - (dy / Math.sqrt(dx * dx + dy * dy || 1)) * bend;
            const cy = draw.controlPoint ? toPx(draw.controlPoint.x, draw.controlPoint.y).y : midY + (dx / Math.sqrt(dx * dx + dy * dy || 1)) * bend;
            pathD = `M ${s.x} ${s.y} Q ${cx} ${cy} ${e.x} ${e.y}`;
          }

          const isPass = draw.type === 'arrow_pass';
          const strokeColor = draw.color || (isPass ? '#facc15' : '#00f0ff');
          const markerId = isPass ? 'url(#marker-pass-arrow)' : 'url(#marker-run-arrow)';

          return (
            <g key={draw.id}>
              {/* Outer Glow Line */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isPass ? '5' : '6'}
                strokeOpacity="0.3"
                strokeLinecap="round"
              />
              {/* Main Arrow Line */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isPass ? '2.5' : '3.5'}
                strokeDasharray={isPass ? '8 6' : undefined}
                className={isPass ? 'animate-laser' : ''}
                markerEnd={markerId}
                strokeLinecap="round"
              />
            </g>
          );
        }

        if (draw.type === 'compactness') {
          // Polygon connecting player coordinates
          const blockPlayers = players.filter((p) => draw.playerIds.includes(p.id));
          if (blockPlayers.length < 3) return null;

          const pointsStr = blockPlayers
            .map((p) => {
              const pos = toPx(p.x, p.y);
              return `${pos.x},${pos.y}`;
            })
            .join(' ');

          return (
            <g key={draw.id}>
              <polygon
                points={pointsStr}
                fill={draw.color || 'rgba(0, 240, 255, 0.18)'}
                stroke={draw.color || '#00f0ff'}
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </g>
          );
        }

        if (draw.type === 'distance') {
          const pA = players.find((p) => p.id === draw.playerAId);
          const pB = players.find((p) => p.id === draw.playerBId);
          if (!pA || !pB) return null;

          const posA = toPx(pA.x, pA.y);
          const posB = toPx(pB.x, pB.y);
          const midX = (posA.x + posB.x) / 2;
          const midY = (posA.y + posB.y) / 2;

          // Estimate distance in meters (pitch standard: 105m long)
          const dxPct = (pB.x - pA.x) * 1.05; // 105m / 100%
          const dyPct = (pB.y - pA.y) * 0.68; // 68m / 100%
          const distMeters = Math.sqrt(dxPct * dxPct + dyPct * dyPct).toFixed(1);

          return (
            <g key={draw.id}>
              <line
                x1={posA.x}
                y1={posA.y}
                x2={posB.x}
                y2={posB.y}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* Distance Tag Badge */}
              <rect
                x={midX - 26}
                y={midY - 12}
                width="52"
                height="22"
                rx="6"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text
                x={midX}
                y={midY + 3}
                fill="#38bdf8"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {distMeters}m
              </text>
            </g>
          );
        }

        if (draw.type === 'pen') {
          if (!draw.points || draw.points.length < 2) return null;
          const pathD = draw.points.reduce((acc, pt, idx) => {
            const px = toPx(pt.x, pt.y);
            return idx === 0 ? `M ${px.x} ${px.y}` : `${acc} L ${px.x} ${px.y}`;
          }, '');

          return (
            <path
              key={draw.id}
              d={pathD}
              fill="none"
              stroke={draw.color || '#facc15'}
              strokeWidth={draw.width || 3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        }

        return null;
      })}
    </g>
  );
};
