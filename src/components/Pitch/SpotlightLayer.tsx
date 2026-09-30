import React from 'react';
import { Player } from '../../types/tactics';
import { PITCH_CONFIG } from '../../constants/pitch';

interface SpotlightLayerProps {
  players: Player[];
}

export const SpotlightLayer: React.FC<SpotlightLayerProps> = ({ players }) => {
  const spotlightPlayers = players.filter((p) => p.isSpotlight);
  if (spotlightPlayers.length === 0) return null;

  const { width, height, padding } = PITCH_CONFIG;
  const pitchWidth = width - padding * 2;
  const pitchHeight = height - padding * 2;

  return (
    <g id="spotlight-overlay" pointerEvents="none">
      <defs>
        {/* Mask that cuts circular holes for spotlighted players */}
        <mask id="spotlight-pitch-mask">
          {/* White background: reveals everything */}
          <rect x="0" y="0" width={width} height={height} fill="#ffffff" />
          {/* Black circles: punches holes out of the dark curtain */}
          {spotlightPlayers.map((player) => {
            const cx = padding + (player.x / 100) * pitchWidth;
            const cy = padding + (player.y / 100) * pitchHeight;
            return (
              <circle
                key={`mask-hole-${player.id}`}
                cx={cx}
                cy={cy}
                r="45"
                fill="#000000"
              />
            );
          })}
        </mask>

        {/* Stadium Light Beam Gradient */}
        <linearGradient id="beamGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#facc15" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Dimmed backdrop covering everything except holes */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0.6)"
        mask="url(#spotlight-pitch-mask)"
        className="transition-opacity duration-500"
      />

      {/* Overhead light beams descending onto player */}
      {spotlightPlayers.map((player) => {
        const cx = padding + (player.x / 100) * pitchWidth;
        const cy = padding + (player.y / 100) * pitchHeight;

        return (
          <g key={`beam-${player.id}`}>
            {/* Cone beam from top rafters */}
            <polygon
              points={`${cx - 5},0 ${cx + 5},0 ${cx + 42},${cy} ${cx - 42},${cy}`}
              fill="url(#beamGradient)"
            />
          </g>
        );
      })}
    </g>
  );
};
