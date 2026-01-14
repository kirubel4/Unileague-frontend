export interface ApiPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  isAvailable?: boolean;
}

export type Player = ApiPlayer & {
  isSelected: boolean;
  assignedPosition: PlayerPosition | null;
  role: LineupRole | null;
  isCaptain: boolean;
};

export enum LineupRole {
  STARTING = "STARTING",
  BENCH = "BENCH",
}

export enum PlayerPosition {
  GK = "GK",
  RB = "RB",
  RCB = "RCB",
  LCB = "LCB",
  LB = "LB",
  CDM = "CDM",
  CM = "CM",
  CAM = "CAM",
  RW = "RW",
  LW = "LW",
  ST = "ST",
  CB = "CB",
  RM = "RM",
  LM = "LM",
  CF = "CF",
}

// Formation configurations
export const FORMATIONS = [
  {
    value: "4-3-3",
    label: "4-3-3",
    positions: [
      "GK",
      "RB",
      "RCB",
      "LCB",
      "LB",
      "CM",
      "CM",
      "CM",
      "RW",
      "ST",
      "LW",
    ],
  },
  {
    value: "4-4-2",
    label: "4-4-2",
    positions: [
      "GK",
      "RB",
      "RCB",
      "LCB",
      "LB",
      "RM",
      "CM",
      "CM",
      "LM",
      "ST",
      "ST",
    ],
  },
  {
    value: "4-2-3-1",
    label: "4-2-3-1",
    positions: [
      "GK",
      "RB",
      "RCB",
      "LCB",
      "LB",
      "CDM",
      "CDM",
      "RW",
      "CAM",
      "LW",
      "ST",
    ],
  },
  {
    value: "3-5-2",
    label: "3-5-2",
    positions: [
      "GK",
      "RCB",
      "CB",
      "LCB",
      "RM",
      "CM",
      "CDM",
      "CM",
      "LM",
      "ST",
      "ST",
    ],
  },
  {
    value: "4-3-2-1",
    label: "4-3-2-1",
    positions: [
      "GK",
      "RB",
      "RCB",
      "LCB",
      "LB",
      "CM",
      "CM",
      "CM",
      "CAM",
      "CAM",
      "ST",
    ],
  },
  {
    value: "3-4-3",
    label: "3-4-3",
    positions: [
      "GK",
      "RCB",
      "CB",
      "LCB",
      "RM",
      "CM",
      "CM",
      "LM",
      "RW",
      "ST",
      "LW",
    ],
  },
];

export interface PositionSlot {
  position: PlayerPosition;
  player: Player | null;
}

export interface MatchInfo {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  teamId: string;
}
