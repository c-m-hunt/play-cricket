import type { Match } from '../lib/interface/matches.js'
import type { ResultSummary } from '../lib/interface/resultSummary.js'

/**
 * Helper functions for MCP server to process and filter cricket data
 * These functions optimize data for LLM consumption by removing unnecessary fields
 */

// Optimized types for LLM-friendly responses
export interface TeamInfo {
  team_id: string
  team_name: string
  club_id: string
  club_name: string
}

export interface FixtureSummary {
  match_id: number
  match_date: string
  match_time: string
  home_team: string
  home_team_id: string
  away_team: string
  away_team_id: string
  ground_name: string
  competition_name: string
  competition_type: string
}

export interface ResultBrief {
  match_id: number
  match_date: string
  home_team: string
  home_team_id: string
  away_team: string
  away_team_id: string
  result: string
  result_description: string
  home_score?: string
  away_score?: string
  ground_name: string
  competition_name: string
}

/**
 * Extract unique teams from matches and results
 */
export function extractUniqueTeams(matches: Match[], results: ResultSummary[]): TeamInfo[] {
  const teamsMap = new Map<string, TeamInfo>()

  // Process matches
  for (const match of matches) {
    if (match.home_team_id && !teamsMap.has(match.home_team_id)) {
      teamsMap.set(match.home_team_id, {
        team_id: match.home_team_id,
        team_name: match.home_team_name,
        club_id: match.home_club_id,
        club_name: match.home_club_name,
      })
    }
    if (match.away_team_id && !teamsMap.has(match.away_team_id)) {
      teamsMap.set(match.away_team_id, {
        team_id: match.away_team_id,
        team_name: match.away_team_name,
        club_id: match.away_club_id,
        club_name: match.away_club_name,
      })
    }
  }

  // Process results
  for (const result of results) {
    if (result.home_team_id && !teamsMap.has(result.home_team_id)) {
      teamsMap.set(result.home_team_id, {
        team_id: result.home_team_id,
        team_name: result.home_team_name,
        club_id: result.home_club_id,
        club_name: result.home_club_name,
      })
    }
    if (result.away_team_id && !teamsMap.has(result.away_team_id)) {
      teamsMap.set(result.away_team_id, {
        team_id: result.away_team_id,
        team_name: result.away_team_name,
        club_id: result.away_club_id,
        club_name: result.away_club_name,
      })
    }
  }

  return Array.from(teamsMap.values()).sort((a, b) => a.team_name.localeCompare(b.team_name))
}

/**
 * Filter matches for a specific team and convert to fixture summary
 */
export function filterTeamFixtures(matches: Match[], teamId: string): FixtureSummary[] {
  return matches
    .filter((match) => match.home_team_id === teamId || match.away_team_id === teamId)
    .map((match) => ({
      match_id: match.id,
      match_date: match.match_date,
      match_time: match.match_time,
      home_team: match.home_team_name,
      home_team_id: match.home_team_id,
      away_team: match.away_team_name,
      away_team_id: match.away_team_id,
      ground_name: match.ground_name,
      competition_name: match.competition_name,
      competition_type: match.competition_type,
    }))
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
}

/**
 * Filter results for a specific team and convert to brief summary
 */
export function filterTeamResults(results: ResultSummary[], teamId: string): ResultBrief[] {
  return results
    .filter((result) => result.home_team_id === teamId || result.away_team_id === teamId)
    .map((result) => {
      // Extract scores from innings if available
      let homeScore: string | undefined
      let awayScore: string | undefined

      if (result.innings && result.innings.length > 0) {
        const homeInnings = result.innings.filter(
          (inn) => inn.team_batting_id === result.home_team_id,
        )
        const awayInnings = result.innings.filter(
          (inn) => inn.team_batting_id === result.away_team_id,
        )

        if (homeInnings.length > 0) {
          const inn = homeInnings[0]
          homeScore = `${inn.runs}/${inn.wickets} (${inn.overs}${inn.balls !== '0' ? `.${inn.balls}` : ''} overs)`
        }
        if (awayInnings.length > 0) {
          const inn = awayInnings[0]
          awayScore = `${inn.runs}/${inn.wickets} (${inn.overs}${inn.balls !== '0' ? `.${inn.balls}` : ''} overs)`
        }
      }

      return {
        match_id: result.id,
        match_date: result.match_date,
        home_team: result.home_team_name,
        home_team_id: result.home_team_id,
        away_team: result.away_team_name,
        away_team_id: result.away_team_id,
        result: result.result,
        result_description: result.result_description,
        home_score: homeScore,
        away_score: awayScore,
        ground_name: result.ground_name,
        competition_name: result.competition_name,
      }
    })
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime())
}

/**
 * Filter matches by date range
 */
export function filterFixturesByDate(matches: Match[]): FixtureSummary[] {
  return matches
    .map((match) => ({
      match_id: match.id,
      match_date: match.match_date,
      match_time: match.match_time,
      home_team: match.home_team_name,
      home_team_id: match.home_team_id,
      away_team: match.away_team_name,
      away_team_id: match.away_team_id,
      ground_name: match.ground_name,
      competition_name: match.competition_name,
      competition_type: match.competition_type,
    }))
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
}

/**
 * Filter results by date range and convert to brief summary
 */
export function filterResultsByDate(results: ResultSummary[]): ResultBrief[] {
  return results
    .map((result) => {
      // Extract scores from innings if available
      let homeScore: string | undefined
      let awayScore: string | undefined

      if (result.innings && result.innings.length > 0) {
        const homeInnings = result.innings.filter(
          (inn) => inn.team_batting_id === result.home_team_id,
        )
        const awayInnings = result.innings.filter(
          (inn) => inn.team_batting_id === result.away_team_id,
        )

        if (homeInnings.length > 0) {
          const inn = homeInnings[0]
          homeScore = `${inn.runs}/${inn.wickets} (${inn.overs}${inn.balls !== '0' ? `.${inn.balls}` : ''} overs)`
        }
        if (awayInnings.length > 0) {
          const inn = awayInnings[0]
          awayScore = `${inn.runs}/${inn.wickets} (${inn.overs}${inn.balls !== '0' ? `.${inn.balls}` : ''} overs)`
        }
      }

      return {
        match_id: result.id,
        match_date: result.match_date,
        home_team: result.home_team_name,
        home_team_id: result.home_team_id,
        away_team: result.away_team_name,
        away_team_id: result.away_team_id,
        result: result.result,
        result_description: result.result_description,
        home_score: homeScore,
        away_score: awayScore,
        ground_name: result.ground_name,
        competition_name: result.competition_name,
      }
    })
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime())
}
