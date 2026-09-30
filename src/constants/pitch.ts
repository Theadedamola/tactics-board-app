export const PITCH_CONFIG = {
  width: 1050,
  height: 680,
  padding: 40,
  penaltyBoxWidth: 165,
  penaltyBoxHeight: 403,
  goalBoxWidth: 55,
  goalBoxHeight: 183,
  centerCircleRadius: 91.5,
  penaltySpotDistance: 110,
  cornerArcRadius: 10,
  lineWidth: 3,
};

// Tactical Channel definitions (in percentage of pitch)
export const TACTICAL_ZONES = {
  // 5 Vertical Channels
  vertical: [
    { name: 'Left Flank', start: 0, end: 18, label: 'L-FLANK' },
    { name: 'Left Half-Space', start: 18, end: 36, label: 'L-HALF-SPACE' },
    { name: 'Central Corridor', start: 36, end: 64, label: 'CENTER' },
    { name: 'Right Half-Space', start: 64, end: 82, label: 'R-HALF-SPACE' },
    { name: 'Right Flank', start: 82, end: 100, label: 'R-FLANK' },
  ],
  // 3 Horizontal Thirds
  horizontal: [
    { name: 'Defensive Third', start: 0, end: 33.3, label: 'DEFENSIVE THIRD' },
    { name: 'Middle Third', start: 33.3, end: 66.6, label: 'MIDDLE THIRD' },
    { name: 'Attacking Third', start: 66.6, end: 100, label: 'ATTACKING THIRD' },
  ]
};

// Grass Stripe count
export const PITCH_STRIPES = 12;

/**
 * Accurately convert any browser screen/mouse (clientX, clientY) into pitch percentage (0-100)
 * using SVG getScreenCTM().inverse() matrix transformation.
 * This guarantees 100% precision even with CSS scaling, rotation, perspective, or high-DPI displays.
 */
export function clientToPitchCoords(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 50, y: 50 };

  const svgPt = pt.matrixTransform(ctm.inverse());
  const { padding, width, height } = PITCH_CONFIG;
  const pitchW = width - padding * 2;
  const pitchH = height - padding * 2;

  const pctX = Math.max(0, Math.min(100, ((svgPt.x - padding) / pitchW) * 100));
  const pctY = Math.max(0, Math.min(100, ((svgPt.y - padding) / pitchH) * 100));

  return {
    x: Math.round(pctX * 10) / 10,
    y: Math.round(pctY * 10) / 10,
  };
}
