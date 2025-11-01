export interface CompetitionTeamsResponse {
  competition_teams: CompetitionTeam[]
}

export interface CompetitionTeam {
  club_id: string
  club_name: string
  team_id: string
  team_name: string
}
