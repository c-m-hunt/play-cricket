export interface MatchesResponse {
  matches: Match[];
}

export interface Match {
  id: number;
  status: Status;
  published: Published;
  last_updated: string;
  league_name: string;
  league_id: string;
  competition_name: string;
  competition_id: string;
  competition_type: CompetitionType;
  match_type: MatchType;
  game_type: GameType;
  season: string;
  match_date: string;
  match_time: string;
  ground_name: string;
  ground_id: string;
  ground_latitude: string;
  ground_longitude: string;
  home_club_name: string;
  home_team_name: string;
  home_team_id: string;
  home_club_id: string;
  away_club_name: string;
  away_team_name: string;
  away_team_id: string;
  away_club_id: string;
  umpire_1_name: string;
  umpire_1_id: string;
  umpire_2_name: string;
  umpire_2_id: string;
  umpire_3_name: string;
  umpire_3_id: string;
  referee_name: string;
  referee_id: string;
  scorer_1_name: string;
  scorer_1_id: string;
  scorer_2_name: string;
  scorer_2_id: string;
}

export enum CompetitionType {
  Cup = "Cup",
  League = "League",
  Friendly = "Friendly",
}

export enum GameType {
  Standard = "Standard",
}

export enum MatchType {
  LimitedOvers = "Limited Overs",
}

export enum Published {
  Yes = "Yes",
  No = "No",
}

export enum Status {
  New = "New",
}
