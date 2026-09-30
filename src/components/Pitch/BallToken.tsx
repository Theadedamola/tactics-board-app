import React from 'react';
import { Ball } from '../../types/tactics';
import { PITCH_CONFIG } from '../../constants/pitch';

interface BallTokenProps {
  ball: Ball;
  isInteractive: boolean;
  onDragStart?: (e: React.PointerEvent) => void;
}

export const BallToken: React.FC<BallTokenProps> = ({
  ball,
  isInteractive,
  onDragStart,
}) => {
  const { width, height, padding } = PITCH_CONFIG;
  const pitchWidth = width - padding * 2;
  const pitchHeight = height - padding * 2;

  const cx = padding + (ball.x / 100) * pitchWidth;
  const cy = padding + (ball.y / 100) * pitchHeight;

  return (
    <g
      id="ball-token"
      style={{
        cursor: isInteractive ? 'grab' : 'default',
      }}
      className="select-none"
      onPointerDown={(e) => {
        if (!isInteractive) return;
        if (onDragStart) onDragStart(e);
      }}
    >
      {/* Ball Shadow */}
      <ellipse
        cx={cx}
        cy={cy + 5}
        rx="10"
        ry="5"
        fill="rgba(0, 0, 0, 0.6)"
      />

      {/* Ball Outer White Sphere */}
      <circle
        cx={cx}
        cy={cy}
        r="11"
        fill="#ffffff"
        stroke="#1e293b"
        strokeWidth="1.2"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}
      />

      {/* Modern Match Ball Panels */}
      <polygon
        points={`${cx},${cy - 5} ${cx - 5},${cy - 1} ${cx - 3},${cy + 5} ${cx + 3},${cy + 5} ${cx + 5},${cy - 1}`}
        fill="#0f172a"
      />
      {/* Panel connect lines */}
      <line x1={cx} y1={cy - 5} x2={cx} y2={cy - 10} stroke="#0f172a" strokeWidth="1" />
      <line x1={cx - 5} y1={cy - 1} x2={cx - 10} y2={cy} stroke="#0f172a" strokeWidth="1" />
      <line x1={cx + 5} y1={cy - 1} x2={cx + 10} y2={cy} stroke="#0f172a" strokeWidth="1" />
      <line x1={cx - 3} y1={cy + 5} x2={cx - 6} y2={cy + 9} stroke="#0f172a" strokeWidth="1" />
      <line x1={cx + 3} y1={cy + 5} x2={cx + 6} y2={cy + 9} stroke="#0f172a" strokeWidth="1" />

      {/* Neon Glow Rim */}
      <circle
        cx={cx}
        cy={cy}
        r="12"
        fill="none"
        stroke="#facc15"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
    </g>
  );
};
