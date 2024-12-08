export interface BallRun {
  ballCom?: string;
  ballNum: number;
  striker: string;
  nonStriker: string;
  bowler: string;
  runs: number;
  extras: number;
  wides: boolean;
  byes: boolean;
  legbyes: boolean;
  noBall: boolean;
  wickets: boolean;
}

export interface Inning {
  _id: string;
  overs: number;
  battingTeam: teamInterface;
  bowlingTeam: teamInterface;
  ballRun: BallRun[];
  teamScore: number;
  match: string | null;
  inningsEnded: boolean;
}

export interface teamInterface {
  _id: string;
  teamName: string;
  players: [{ _id: string; name: string }];
  teamFlag: string;
}

export interface PlayerInterface {
  _id: string;
  name: string;
  role: string;
  formats: string[];
}

export interface newBallInterace {
  eventString: string;
  score: number;
  wicket: number;
}

export interface PlayerStat {
  runs: number;
}