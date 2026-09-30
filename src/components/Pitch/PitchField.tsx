import React from 'react';
import { PITCH_CONFIG, TACTICAL_ZONES, PITCH_STRIPES } from '../../constants/pitch';

interface PitchFieldProps {
  showTacticalChannels: boolean;
  viewMode: '2d' | 'perspective';
  svgRef?: React.Ref<SVGSVGElement>;
  onPointerDown?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: (e: React.PointerEvent<SVGSVGElement>) => void;
  children?: React.ReactNode;
}

export const PitchField: React.FC<PitchFieldProps> = ({
  showTacticalChannels,
  viewMode,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  children,
}) => {
  const {
    width,
    height,
    padding,
    penaltyBoxWidth,
    penaltyBoxHeight,
    goalBoxWidth,
    goalBoxHeight,
    centerCircleRadius,
    penaltySpotDistance,
    cornerArcRadius,
    lineWidth,
  } = PITCH_CONFIG;

  const pitchLeft = padding;
  const pitchTop = padding;
  const pitchWidth = width - padding * 2;
  const pitchHeight = height - padding * 2;
  const pitchRight = pitchLeft + pitchWidth;
  const pitchBottom = pitchTop + pitchHeight;
  const centerX = pitchLeft + pitchWidth / 2;
  const centerY = pitchTop + pitchHeight / 2;

  // Stripe width
  const stripeWidth = pitchWidth / PITCH_STRIPES;

  return (
    <div className={`w-full h-full flex items-center justify-center p-1 sm:p-4 transition-all duration-700 pitch-perspective-container`}>
      <div
        className={`relative w-full aspect-[16/10] max-h-[92vh] max-w-[1400px] select-none rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 ${
          viewMode === 'perspective' ? 'pitch-perspective-active' : 'pitch-perspective-flat'
        }`}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full block"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <defs>
            {/* Turf Gradients */}
            <linearGradient id="grassStripeA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="100%" stopColor="#0f4224" />
            </linearGradient>
            <linearGradient id="grassStripeB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#166534" />
              <stop offset="100%" stopColor="#12512a" />
            </linearGradient>

            {/* Stadium Floodlight Vignette */}
            <radialGradient id="floodlight" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
            </radialGradient>

            {/* Glow Filter for Ball & Active Selections */}
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Half-Space Highlight Pattern */}
            <pattern id="halfSpaceGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 20 M 0 0 L 20 20" fill="none" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* 1. Surrounding Out-of-Bounds Turf */}
          <rect x="0" y="0" width={width} height={height} fill="#092815" />

          {/* 2. Alternating Lawn Grass Stripes */}
          {Array.from({ length: PITCH_STRIPES }).map((_, i) => (
            <rect
              key={i}
              x={pitchLeft + i * stripeWidth}
              y={pitchTop}
              width={stripeWidth}
              height={pitchHeight}
              fill={i % 2 === 0 ? 'url(#grassStripeA)' : 'url(#grassStripeB)'}
            />
          ))}

          {/* 3. Tactical Zones & 5 Vertical Channels (Toggleable) */}
          {showTacticalChannels && (
            <g className="transition-opacity duration-300">
              {/* Tactical Vertical Dividers (Wings, Half-spaces, Center) */}
              {TACTICAL_ZONES.vertical.map((zone, idx) => {
                const zoneX = pitchLeft + (zone.start / 100) * pitchWidth;
                const zoneW = ((zone.end - zone.start) / 100) * pitchWidth;
                const isHalfSpace = zone.name.includes('Half-Space');

                return (
                  <g key={`zone-${idx}`}>
                    {isHalfSpace && (
                      <rect
                        x={zoneX}
                        y={pitchTop}
                        width={zoneW}
                        height={pitchHeight}
                        fill="url(#halfSpaceGrid)"
                      />
                    )}
                    {idx > 0 && (
                      <line
                        x1={zoneX}
                        y1={pitchTop}
                        x2={zoneX}
                        y2={pitchBottom}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        strokeOpacity="0.45"
                      />
                    )}
                    {/* Zone Label Watermark */}
                    <text
                      x={zoneX + zoneW / 2}
                      y={pitchTop + 24}
                      fill="#38bdf8"
                      fillOpacity="0.45"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      letterSpacing="1.5"
                    >
                      {zone.label}
                    </text>
                  </g>
                );
              })}

              {/* Thirds Dividers */}
              {TACTICAL_ZONES.horizontal.map((third, idx) => {
                const thirdX = pitchLeft + (third.start / 100) * pitchWidth;
                return idx > 0 ? (
                  <line
                    key={`third-${idx}`}
                    x1={thirdX}
                    y1={pitchTop}
                    x2={thirdX}
                    y2={pitchBottom}
                    stroke="#facc15"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    strokeOpacity="0.3"
                  />
                ) : null;
              })}
            </g>
          )}

          {/* 4. Official Pitch Boundary Lines */}
          <rect
            x={pitchLeft}
            y={pitchTop}
            width={pitchWidth}
            height={pitchHeight}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />

          {/* Halfway Line */}
          <line
            x1={centerX}
            y1={pitchTop}
            x2={centerX}
            y2={pitchBottom}
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />

          {/* Center Circle & Spot */}
          <circle
            cx={centerX}
            cy={centerY}
            r={centerCircleRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          <circle cx={centerX} cy={centerY} r="3.5" fill="#ffffff" />

          {/* Left Penalty Box */}
          <rect
            x={pitchLeft}
            y={centerY - penaltyBoxHeight / 2}
            width={penaltyBoxWidth}
            height={penaltyBoxHeight}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          {/* Left 6-Yard Box */}
          <rect
            x={pitchLeft}
            y={centerY - goalBoxHeight / 2}
            width={goalBoxWidth}
            height={goalBoxHeight}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          {/* Left Penalty Spot & Arc (D) */}
          <circle cx={pitchLeft + penaltySpotDistance} cy={centerY} r="3.5" fill="#ffffff" />
          <path
            d={`M ${pitchLeft + penaltyBoxWidth} ${centerY - 72} A ${centerCircleRadius} ${centerCircleRadius} 0 0 1 ${pitchLeft + penaltyBoxWidth} ${centerY + 72}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />

          {/* Right Penalty Box */}
          <rect
            x={pitchRight - penaltyBoxWidth}
            y={centerY - penaltyBoxHeight / 2}
            width={penaltyBoxWidth}
            height={penaltyBoxHeight}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          {/* Right 6-Yard Box */}
          <rect
            x={pitchRight - goalBoxWidth}
            y={centerY - goalBoxHeight / 2}
            width={goalBoxWidth}
            height={goalBoxHeight}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          {/* Right Penalty Spot & Arc (D) */}
          <circle cx={pitchRight - penaltySpotDistance} cy={centerY} r="3.5" fill="#ffffff" />
          <path
            d={`M ${pitchRight - penaltyBoxWidth} ${centerY - 72} A ${centerCircleRadius} ${centerCircleRadius} 0 0 0 ${pitchRight - penaltyBoxWidth} ${centerY + 72}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />

          {/* Corner Arcs */}
          {/* Top-Left */}
          <path
            d={`M ${pitchLeft} ${pitchTop + cornerArcRadius} A ${cornerArcRadius} ${cornerArcRadius} 0 0 0 ${pitchLeft + cornerArcRadius} ${pitchTop}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          {/* Bottom-Left */}
          <path
            d={`M ${pitchLeft} ${pitchBottom - cornerArcRadius} A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 ${pitchLeft + cornerArcRadius} ${pitchBottom}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          {/* Top-Right */}
          <path
            d={`M ${pitchRight} ${pitchTop + cornerArcRadius} A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 ${pitchRight - cornerArcRadius} ${pitchTop}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />
          {/* Bottom-Right */}
          <path
            d={`M ${pitchRight} ${pitchBottom - cornerArcRadius} A ${cornerArcRadius} ${cornerArcRadius} 0 0 0 ${pitchRight - cornerArcRadius} ${pitchBottom}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={lineWidth}
          />

          {/* Goals (Visual 3D depth outside touchline) */}
          <rect
            x={pitchLeft - 22}
            y={centerY - 55}
            width="22"
            height="110"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
          />
          <rect
            x={pitchRight}
            y={centerY - 55}
            width="22"
            height="110"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
          />

          {/* 5. Stadium Lighting & Vignette Overlay */}
          <rect x="0" y="0" width={width} height={height} fill="url(#floodlight)" pointerEvents="none" />

          {/* 6. Dynamic Tactical Children (Spotlights, Drawings, Players, Ball) */}
          {children}
        </svg>
      </div>
    </div>
  );
};
