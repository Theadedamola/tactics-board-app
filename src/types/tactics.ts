export type TeamSide = 'home' | 'away';

export type PlayerRole = 'GK' | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB' | 'DM' | 'CM' | 'AM' | 'LW' | 'RW' | 'CF' | 'ST';

export interface Position {
  x: number; // 0 to 100 percentage of pitch width
  y: number; // 0 to 100 percentage of pitch height
}

export interface Player {
  id: string;
  team: TeamSide;
  number: number;
  name: string;
  role: PlayerRole;
  x: number; // percentage
  y: number; // percentage
  isSpotlight?: boolean;
}

export interface Ball {
  x: number;
  y: number;
  z?: number; // for arc/lofted visualization
}

export type FormationType = 
  | '4-3-3' 
  | '4-2-3-1' 
  | '4-4-2' 
  | '3-5-2' 
  | '3-4-3' 
  | '5-3-2' 
  | '5-4-1' 
  | '4-1-4-1';

export type TacticalPhase = 'possession' | 'out_of_possession' | 'high_press' | 'low_block';

export type ToolType = 
  | 'select' 
  | 'curve_run' 
  | 'arrow_run' 
  | 'arrow_pass' 
  | 'spotlight' 
  | 'compactness' 
  | 'distance' 
  | 'pen' 
  | 'clear';

export interface ArrowDrawing {
  id: string;
  type: 'arrow_run' | 'arrow_pass' | 'curve_run';
  start: Position;
  end: Position;
  controlPoint?: Position; // for curved runs
  color: string;
}

export interface CompactnessDrawing {
  id: string;
  type: 'compactness';
  team: TeamSide;
  playerIds: string[];
  color: string;
}

export interface DistanceDrawing {
  id: string;
  type: 'distance';
  playerAId: string;
  playerBId: string;
}

export interface PenStrokeDrawing {
  id: string;
  type: 'pen';
  points: Position[];
  color: string;
  width: number;
}

export type DrawingElement = ArrowDrawing | CompactnessDrawing | DistanceDrawing | PenStrokeDrawing;

export interface TacticalFrame {
  id: string;
  name: string;
  timestamp: number;
  players: Player[];
  ball: Ball;
  drawings: DrawingElement[];
}

export interface BoardState {
  players: Player[];
  ball: Ball;
  drawings: DrawingElement[];
  selectedPlayerId: string | null;
  activeTool: ToolType;
  homeFormation: FormationType;
  awayFormation: FormationType;
  homeColor: string;
  awayColor: string;
  homeTeamName: string;
  awayTeamName: string;
  showTacticalChannels: boolean;
  pitchView: '2d' | 'perspective';
  teamVisibility: 'both' | 'home' | 'away';
  keyframes: TacticalFrame[];
  currentFrameIndex: number;
  isPlayingAnimation: boolean;
}

export type SyncMessage =
  | { type: 'SYNC_FULL_STATE'; payload: BoardState }
  | { type: 'MOVE_PLAYER'; payload: { id: string; x: number; y: number } }
  | { type: 'MOVE_BALL'; payload: { x: number; y: number } }
  | { type: 'SET_FORMATION'; payload: { team: TeamSide; formation: FormationType } }
  | { type: 'TOGGLE_SPOTLIGHT'; payload: { playerId: string } }
  | { type: 'ADD_DRAWING'; payload: DrawingElement }
  | { type: 'CLEAR_DRAWINGS' }
  | { type: 'TRIGGER_ANIMATION'; payload: { play: boolean; frameIndex?: number } }
  | { type: 'TOGGLE_VIEW'; payload: '2d' | 'perspective' }
  | { type: 'TOGGLE_CHANNELS'; payload: boolean }
  | { type: 'SET_TEAM_VISIBILITY'; payload: 'both' | 'home' | 'away' }
  | { type: 'SWITCH_SIDES' }
  | { type: 'SWAP_COLORS' }
  | { type: 'SET_TEAM_NAME'; payload: { team: TeamSide; name: string } }
  | { type: 'SET_TEAM_COLOR'; payload: { team: TeamSide; color: string } };
