import React from 'react';
import { Player } from '../../types/tactics';
import { PITCH_CONFIG } from '../../constants/pitch';

interface PlayerTokenProps {
  player: Player;
  teamColor: string;
  isSelected: boolean;
  isInteractive: boolean;
  onSelect: (player: Player) => void;
  onDragStart?: (player: Player, e: React.PointerEvent) => void;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({
  player,
  teamColor,
  isSelected,
  isInteractive,
  onSelect,
  onDragStart,
}) => {
  const { width, height, padding } = PITCH_CONFIG;
  const pitchWidth = width - padding * 2;
  const pitchHeight = height - padding * 2;

  // Convert percentage (0-100) to pitch SVG coordinates
  const cx = padding + (player.x / 100) * pitchWidth;
  const cy = padding + (player.y / 100) * pitchHeight;

  const isGK = player.role === 'GK';
  const fillColor = isGK ? '#eab308' : teamColor; // Yellow for GK

  return (
    <g
      id={`player-token-${player.id}`}
      style={{
        cursor: isInteractive ? 'grab' : 'default',
      }}
      className="select-none"
      onPointerDown={(e) => {
        if (!isInteractive) return;
        onSelect(player);
        if (onDragStart) onDragStart(player, e);
      }}
    >
      {/* 1. Sky Sports Spotlight Halo */}
      {player.isSpotlight && (
        <g>
          {/* Outer Pulsing Aura */}
          <circle
            cx={cx}
            cy={cy}
            r="42"
            fill="rgba(250, 204, 21, 0.25)"
            stroke="#facc15"
            strokeWidth="2"
            strokeDasharray="4 3"
            className="animate-halo"
          />
          {/* Inner Light Cone */}
          <circle
            cx={cx}
            cy={cy}
            r="32"
            fill="rgba(250, 204, 21, 0.4)"
          />
          {/* Spotlight Pin Text */}
          <rect
            x={cx - 36}
            y={cy - 52}
            width="72"
            height="18"
            rx="4"
            fill="#facc15"
          />
          <text
            x={cx}
            y={cy - 40}
            fill="#090d16"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            KEY PLAYER
          </text>
        </g>
      )}

      {/* 2. Selection Ring */}
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r="26"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="3"
          strokeDasharray="5 3"
          className="animate-spin"
          style={{ animationDuration: '6s' }}
        />
      )}

      {/* 3. Shadow under player chip */}
      <ellipse
        cx={cx}
        cy={cy + 4}
        rx="18"
        ry="8"
        fill="rgba(0, 0, 0, 0.5)"
      />

      {/* 4. Player Token Body */}
      <circle
        cx={cx}
        cy={cy}
        r="20"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="2.5"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
        }}
      />

      {/* Glossy highlight layer */}
      <path
        d={`M ${cx - 14} ${cy - 12} A 18 18 0 0 1 ${cx + 14} ${cy - 12} A 18 10 0 0 0 ${cx - 14} ${cy - 12}`}
        fill="rgba(255, 255, 255, 0.35)"
      />

      {/* 5. Squad Number */}
      <text
        x={cx}
        y={cy + 5.5}
        fill={isGK ? '#0f172a' : '#ffffff'}
        fontSize="14"
        fontWeight="800"
        textAnchor="middle"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: isGK ? 'none' : '0 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        {player.number}
      </text>

      {/* 6. Name and Role Tag */}
      <g transform={`translate(${cx}, ${cy + 28})`}>
        <rect
          x="-28"
          y="-2"
          width="56"
          height="14"
          rx="7"
          fill="rgba(15, 23, 42, 0.85)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
        <text
          x="0"
          y="8"
          fill="#f8fafc"
          fontSize="9"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          {player.role} {player.name}
        </text>
      </g>
    </g>
  );
};
