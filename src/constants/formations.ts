import { FormationType, Player, TeamSide } from '../types/tactics';

interface FormationSlot {
  number: number;
  role: Player['role'];
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export const FORMATION_PRESETS: Record<FormationType, FormationSlot[]> = {
  '4-3-3': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 2, role: 'RB', name: 'Right Back', x: 18, y: 84 },
    { number: 4, role: 'CB', name: 'Right CB', x: 15, y: 62 },
    { number: 5, role: 'CB', name: 'Left CB', x: 15, y: 38 },
    { number: 3, role: 'LB', name: 'Left Back', x: 18, y: 16 },
    { number: 6, role: 'DM', name: 'Pivot 6', x: 26, y: 50 },
    { number: 8, role: 'CM', name: 'Right 8', x: 34, y: 68 },
    { number: 10, role: 'CM', name: 'Left 8', x: 34, y: 32 },
    { number: 7, role: 'RW', name: 'Right Wing', x: 42, y: 82 },
    { number: 9, role: 'ST', name: 'Striker', x: 45, y: 50 },
    { number: 11, role: 'LW', name: 'Left Wing', x: 42, y: 18 },
  ],
  '4-2-3-1': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 2, role: 'RB', name: 'Right Back', x: 18, y: 84 },
    { number: 4, role: 'CB', name: 'Right CB', x: 15, y: 62 },
    { number: 5, role: 'CB', name: 'Left CB', x: 15, y: 38 },
    { number: 3, role: 'LB', name: 'Left Back', x: 18, y: 16 },
    { number: 6, role: 'DM', name: 'Right DM', x: 27, y: 62 },
    { number: 8, role: 'DM', name: 'Left DM', x: 27, y: 38 },
    { number: 7, role: 'RW', name: 'Right AM', x: 37, y: 80 },
    { number: 10, role: 'AM', name: 'No. 10', x: 36, y: 50 },
    { number: 11, role: 'LW', name: 'Left AM', x: 37, y: 20 },
    { number: 9, role: 'ST', name: 'Striker', x: 45, y: 50 },
  ],
  '4-4-2': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 2, role: 'RB', name: 'Right Back', x: 18, y: 84 },
    { number: 4, role: 'CB', name: 'Right CB', x: 15, y: 62 },
    { number: 5, role: 'CB', name: 'Left CB', x: 15, y: 38 },
    { number: 3, role: 'LB', name: 'Left Back', x: 18, y: 16 },
    { number: 7, role: 'RW', name: 'Right Mid', x: 32, y: 85 },
    { number: 8, role: 'CM', name: 'Right CM', x: 30, y: 62 },
    { number: 6, role: 'CM', name: 'Left CM', x: 30, y: 38 },
    { number: 11, role: 'LW', name: 'Left Mid', x: 32, y: 15 },
    { number: 9, role: 'ST', name: 'Right ST', x: 43, y: 62 },
    { number: 10, role: 'ST', name: 'Left ST', x: 43, y: 38 },
  ],
  '3-5-2': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 4, role: 'CB', name: 'Right CB', x: 16, y: 72 },
    { number: 5, role: 'CB', name: 'Central CB', x: 14, y: 50 },
    { number: 3, role: 'CB', name: 'Left CB', x: 16, y: 28 },
    { number: 2, role: 'RWB', name: 'Right Wingback', x: 28, y: 88 },
    { number: 6, role: 'DM', name: 'Anchor 6', x: 26, y: 50 },
    { number: 8, role: 'CM', name: 'Right 8', x: 34, y: 65 },
    { number: 10, role: 'CM', name: 'Left 8', x: 34, y: 35 },
    { number: 11, role: 'LWB', name: 'Left Wingback', x: 28, y: 12 },
    { number: 9, role: 'ST', name: 'Right ST', x: 43, y: 62 },
    { number: 7, role: 'ST', name: 'Left ST', x: 43, y: 38 },
  ],
  '3-4-3': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 4, role: 'CB', name: 'Right CB', x: 16, y: 72 },
    { number: 5, role: 'CB', name: 'Central CB', x: 14, y: 50 },
    { number: 3, role: 'CB', name: 'Left CB', x: 16, y: 28 },
    { number: 2, role: 'RWB', name: 'Right Wingback', x: 29, y: 86 },
    { number: 8, role: 'CM', name: 'Right CM', x: 30, y: 62 },
    { number: 6, role: 'CM', name: 'Left CM', x: 30, y: 38 },
    { number: 11, role: 'LWB', name: 'Left Wingback', x: 29, y: 14 },
    { number: 7, role: 'RW', name: 'Right Winger', x: 42, y: 80 },
    { number: 9, role: 'ST', name: 'Striker', x: 44, y: 50 },
    { number: 10, role: 'LW', name: 'Left Winger', x: 42, y: 20 },
  ],
  '5-3-2': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 2, role: 'RWB', name: 'Right Wingback', x: 19, y: 88 },
    { number: 4, role: 'CB', name: 'Right CB', x: 15, y: 68 },
    { number: 5, role: 'CB', name: 'Central CB', x: 13, y: 50 },
    { number: 6, role: 'CB', name: 'Left CB', x: 15, y: 32 },
    { number: 3, role: 'LWB', name: 'Left Wingback', x: 19, y: 12 },
    { number: 8, role: 'CM', name: 'Right 8', x: 30, y: 66 },
    { number: 10, role: 'DM', name: 'Central 6', x: 26, y: 50 },
    { number: 11, role: 'CM', name: 'Left 8', x: 30, y: 34 },
    { number: 9, role: 'ST', name: 'Right ST', x: 43, y: 62 },
    { number: 7, role: 'ST', name: 'Left ST', x: 43, y: 38 },
  ],
  '5-4-1': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 2, role: 'RWB', name: 'Right Wingback', x: 19, y: 88 },
    { number: 4, role: 'CB', name: 'Right CB', x: 15, y: 68 },
    { number: 5, role: 'CB', name: 'Central CB', x: 13, y: 50 },
    { number: 6, role: 'CB', name: 'Left CB', x: 15, y: 32 },
    { number: 3, role: 'LWB', name: 'Left Wingback', x: 19, y: 12 },
    { number: 7, role: 'RW', name: 'Right Mid', x: 30, y: 82 },
    { number: 8, role: 'CM', name: 'Right CM', x: 28, y: 62 },
    { number: 10, role: 'CM', name: 'Left CM', x: 28, y: 38 },
    { number: 11, role: 'LW', name: 'Left Mid', x: 30, y: 18 },
    { number: 9, role: 'ST', name: 'Striker', x: 43, y: 50 },
  ],
  '4-1-4-1': [
    { number: 1, role: 'GK', name: 'Keeper', x: 5, y: 50 },
    { number: 2, role: 'RB', name: 'Right Back', x: 18, y: 84 },
    { number: 4, role: 'CB', name: 'Right CB', x: 15, y: 62 },
    { number: 5, role: 'CB', name: 'Left CB', x: 15, y: 38 },
    { number: 3, role: 'LB', name: 'Left Back', x: 18, y: 16 },
    { number: 6, role: 'DM', name: 'Anchor 6', x: 25, y: 50 },
    { number: 7, role: 'RW', name: 'Right Wing', x: 35, y: 84 },
    { number: 8, role: 'CM', name: 'Right 8', x: 35, y: 64 },
    { number: 10, role: 'CM', name: 'Left 8', x: 35, y: 36 },
    { number: 11, role: 'LW', name: 'Left Wing', x: 35, y: 16 },
    { number: 9, role: 'ST', name: 'Striker', x: 44, y: 50 },
  ],
};

export function getInitialTeamPlayers(team: TeamSide, formation: FormationType): Player[] {
  const slots = FORMATION_PRESETS[formation];
  return slots.map((slot, index) => {
    const isHome = team === 'home';
    const x = isHome ? slot.x : 100 - slot.x;
    const y = isHome ? slot.y : 100 - slot.y;

    return {
      id: `${team}_${index + 1}`,
      team,
      number: slot.number,
      name: `${team === 'home' ? 'H' : 'A'}${slot.number}`,
      role: slot.role,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      isSpotlight: false,
    };
  });
}
