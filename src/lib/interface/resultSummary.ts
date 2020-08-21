export interface Point {
  team_id: number;
  game_points: string;
  penalty_points: string;
  bonus_points_together: string;
  bonus_points_batting: string;
  bonus_points_bowling: string;
  bonus_points_2nd_innings_together: string;
}

export interface Innings {
  team_batting_id: string;
  innings_number: number;
  extra_byes: string;
  extra_leg_byes: string;
  extra_wides: string;
  extra_no_balls: string;
  extra_penalty_runs: string;
  penalties_runs_awarded_in_other_innings: string;
  total_extras: string;
  runs: string;
  wickets: string;
  overs: string;
  balls: string;
  declared: boolean;
  forfeited_innings: boolean;
  revised_target_runs: string;
  revised_target_overs: string;
  revised_target_balls: string;
}

export interface ResultSummary {
  id: number;
  status: string;
  published: string;
  last_updated: string;
  league_id: string;
  competition_name: string;
  competition_id: string;
  competition_type: string;
  match_type: string;
  game_type: string;
  countdown_cricket: string;
  match_date: string;
  match_time: string;
  ground_name: string;
  ground_id: string;
  home_team_name: string;
  home_team_id: string;
  home_club_name: string;
  home_club_id: string;
  away_team_name: string;
  away_team_id: string;
  away_club_name: string;
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
  toss_won_by_team_id: string;
  toss: string;
  batted_first: string;
  no_of_overs: string;
  balls_per_innings: string;
  no_of_innings: string;
  result: string;
  result_description: string;
  result_applied_to: string;
  home_confirmed: string;
  away_confirmed: string;
  result_locked: string;
  scorecard_locked: string;
  match_notes: string;
  points: Point[];
  innings: Innings[];
  league_name: string;
}

export interface ResultSummaryResponse {
  result_summary: ResultSummary[];
}
