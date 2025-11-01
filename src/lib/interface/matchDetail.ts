export interface MatchDetailResponse {
  match_details: [MatchDetail]
}

export interface MatchDetail {
  id: number
  status: string
  published: string
  last_updated: string
  league_name: string
  league_id: string
  competition_name: string
  competition_id: string
  competition_type: string
  match_type: string
  game_type: string
  match_id: string
  match_date: string
  match_time: string
  ground_name: string
  ground_id: string
  home_team_name: string
  home_team_id: string
  home_club_name: string
  home_club_id: string
  away_team_name: string
  away_team_id: string
  away_club_name: string
  away_club_id: string
  umpire_1_name: string
  umpire_1_id: string
  umpire_2_name: string
  umpire_2_id: string
  umpire_3_name: string
  umpire_3_id: string
  referee_name: string
  referee_id: string
  scorer_1_name: string
  scorer_1_id: string
  scorer_2_name: string
  scorer_2_id: string
  toss_won_by_team_id: string
  toss: string
  batted_first: string
  no_of_overs: number
  no_of_innings: string
  no_of_days: string
  no_of_players: string
  no_of_reserves: string
  result: string
  result_description: string
  result_applied_to: string
  match_notes: string
  points: Point[]
  match_result_types: Array<Array<number | string>>
  players: Players
  innings: Inning[]
}

export interface Inning {
  team_batting_name: string
  team_batting_id: string
  innings_number: number
  extra_byes: string
  extra_leg_byes: string
  extra_wides: string
  extra_no_balls: string
  extra_penalty_runs: string
  penalties_runs_awarded_in_other_innings: string
  total_extras: string
  runs: string
  wickets: string
  overs: string
  declared: boolean
  forfeited_innings: boolean
  revised_target_runs: string
  revised_target_overs: string
  bat: Bat[]
  fow: Fow[]
  bowl: Bowl[]
}

export interface Bat {
  position: string
  batsman_name: string
  batsman_id: string
  how_out: string
  fielder_name: string
  fielder_id: string
  bowler_name: string
  bowler_id: string
  runs: string
  fours: string
  sixes: string
  balls: string
}

export interface Bowl {
  bowler_name: string
  bowler_id: string
  overs: string
  maidens: string
  runs: string
  wides: string
  wickets: string
  no_balls: string
}

export interface Fow {
  runs: string
  wickets: number
  batsman_out_name: string
  batsman_out_id: string
  batsman_in_name: string
  batsman_in_id: string
  batsman_in_runs: string
}

export type Players = [
  {
    home_team: Team[]
  },
  {
    away_team: Team[]
  },
]

export interface Team {
  position: number
  player_name: string
  player_id: number
  captain: boolean
  wicket_keeper: boolean
}

export interface Point {
  team_id: number
  game_points: string
  penalty_points: string
  bonus_points_together: string
  bonus_points_batting: string
  bonus_points_bowling: string
  bonus_points_2nd_innings_together: string
}
