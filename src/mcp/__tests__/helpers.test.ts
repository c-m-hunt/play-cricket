import { describe, expect, test } from 'bun:test'
import type { Match } from '../../lib/interface/matches'
import type { ResultSummary } from '../../lib/interface/resultSummary'
import {
  extractUniqueTeams,
  filterFixturesByDate,
  filterResultsByDate,
  filterTeamFixtures,
  filterTeamResults,
} from '../helpers'

// Mock data for testing
const mockMatches: Match[] = [
  {
    id: 1001,
    status: 'New' as any,
    published: 'Yes' as any,
    last_updated: '2024-05-01T10:00:00Z',
    league_name: 'Test League',
    league_id: '100',
    competition_name: 'Division 1',
    competition_id: '200',
    competition_type: 'League' as any,
    match_type: 'Limited Overs' as any,
    game_type: 'Standard' as any,
    season: '2024',
    match_date: '2024-06-15',
    match_time: '14:00',
    ground_name: 'Test Ground 1',
    ground_id: '301',
    ground_latitude: '51.5074',
    ground_longitude: '-0.1278',
    home_club_name: 'Home Club A',
    home_team_name: 'Home Team 1',
    home_team_id: '1',
    home_club_id: '10',
    away_club_name: 'Away Club B',
    away_team_name: 'Away Team 2',
    away_team_id: '2',
    away_club_id: '20',
    umpire_1_name: 'Umpire 1',
    umpire_1_id: '501',
    umpire_2_name: 'Umpire 2',
    umpire_2_id: '502',
    umpire_3_name: '',
    umpire_3_id: '',
    referee_name: '',
    referee_id: '',
    scorer_1_name: 'Scorer 1',
    scorer_1_id: '601',
    scorer_2_name: '',
    scorer_2_id: '',
  },
  {
    id: 1002,
    status: 'New' as any,
    published: 'Yes' as any,
    last_updated: '2024-05-02T10:00:00Z',
    league_name: 'Test League',
    league_id: '100',
    competition_name: 'Division 1',
    competition_id: '200',
    competition_type: 'League' as any,
    match_type: 'Limited Overs' as any,
    game_type: 'Standard' as any,
    season: '2024',
    match_date: '2024-06-22',
    match_time: '14:00',
    ground_name: 'Test Ground 2',
    ground_id: '302',
    ground_latitude: '51.5074',
    ground_longitude: '-0.1278',
    home_club_name: 'Away Club B',
    home_team_name: 'Away Team 2',
    home_team_id: '2',
    home_club_id: '20',
    away_club_name: 'Home Club C',
    away_team_name: 'Home Team 3',
    away_team_id: '3',
    away_club_id: '30',
    umpire_1_name: 'Umpire 3',
    umpire_1_id: '503',
    umpire_2_name: 'Umpire 4',
    umpire_2_id: '504',
    umpire_3_name: '',
    umpire_3_id: '',
    referee_name: '',
    referee_id: '',
    scorer_1_name: 'Scorer 2',
    scorer_1_id: '602',
    scorer_2_name: '',
    scorer_2_id: '',
  },
  {
    id: 1003,
    status: 'New' as any,
    published: 'Yes' as any,
    last_updated: '2024-05-03T10:00:00Z',
    league_name: 'Test League',
    league_id: '100',
    competition_name: 'Division 2',
    competition_id: '201',
    competition_type: 'League' as any,
    match_type: 'Limited Overs' as any,
    game_type: 'Standard' as any,
    season: '2024',
    match_date: '2024-07-01',
    match_time: '13:00',
    ground_name: 'Test Ground 3',
    ground_id: '303',
    ground_latitude: '51.5074',
    ground_longitude: '-0.1278',
    home_club_name: 'Home Club A',
    home_team_name: 'Home Team 1',
    home_team_id: '1',
    home_club_id: '10',
    away_club_name: 'Home Club C',
    away_team_name: 'Home Team 3',
    away_team_id: '3',
    away_club_id: '30',
    umpire_1_name: 'Umpire 5',
    umpire_1_id: '505',
    umpire_2_name: '',
    umpire_2_id: '',
    umpire_3_name: '',
    umpire_3_id: '',
    referee_name: '',
    referee_id: '',
    scorer_1_name: '',
    scorer_1_id: '',
    scorer_2_name: '',
    scorer_2_id: '',
  },
]

const mockResults: ResultSummary[] = [
  {
    id: 2001,
    status: 'Complete',
    published: 'Yes',
    last_updated: '2024-05-10T18:00:00Z',
    league_id: '100',
    competition_name: 'Division 1',
    competition_id: '200',
    competition_type: 'League',
    match_type: 'Limited Overs',
    game_type: 'Standard',
    countdown_cricket: 'No',
    match_date: '2024-05-18',
    match_time: '14:00',
    ground_name: 'Test Ground 1',
    ground_id: '301',
    home_team_name: 'Home Team 1',
    home_team_id: '1',
    home_club_name: 'Home Club A',
    home_club_id: '10',
    away_team_name: 'Away Team 2',
    away_team_id: '2',
    away_club_name: 'Away Club B',
    away_club_id: '20',
    umpire_1_name: 'Umpire 1',
    umpire_1_id: '501',
    umpire_2_name: 'Umpire 2',
    umpire_2_id: '502',
    umpire_3_name: '',
    umpire_3_id: '',
    referee_name: '',
    referee_id: '',
    scorer_1_name: 'Scorer 1',
    scorer_1_id: '601',
    scorer_2_name: 'Scorer 2',
    scorer_2_id: '602',
    toss_won_by_team_id: '1',
    toss: 'bat',
    batted_first: '1',
    no_of_overs: '40',
    balls_per_innings: '240',
    no_of_innings: '2',
    result: 'H',
    result_description: 'Home Team 1 won by 45 runs',
    result_applied_to: '1',
    home_confirmed: 'Yes',
    away_confirmed: 'Yes',
    result_locked: 'Yes',
    scorecard_locked: 'Yes',
    match_notes: '',
    points: [
      {
        team_id: 1,
        game_points: '20',
        penalty_points: '0',
        bonus_points_together: '3',
        bonus_points_batting: '2',
        bonus_points_bowling: '1',
        bonus_points_2nd_innings_together: '0',
      },
    ],
    innings: [
      {
        team_batting_id: '1',
        innings_number: 1,
        extra_byes: '5',
        extra_leg_byes: '3',
        extra_wides: '8',
        extra_no_balls: '2',
        extra_penalty_runs: '0',
        penalties_runs_awarded_in_other_innings: '0',
        total_extras: '18',
        runs: '245',
        wickets: '7',
        overs: '40',
        balls: '0',
        declared: false,
        forfeited_innings: false,
        revised_target_runs: '',
        revised_target_overs: '',
        revised_target_balls: '',
      },
      {
        team_batting_id: '2',
        innings_number: 2,
        extra_byes: '4',
        extra_leg_byes: '2',
        extra_wides: '10',
        extra_no_balls: '4',
        extra_penalty_runs: '0',
        penalties_runs_awarded_in_other_innings: '0',
        total_extras: '20',
        runs: '200',
        wickets: '10',
        overs: '38',
        balls: '2',
        declared: false,
        forfeited_innings: false,
        revised_target_runs: '',
        revised_target_overs: '',
        revised_target_balls: '',
      },
    ],
    league_name: 'Test League',
  },
  {
    id: 2002,
    status: 'Complete',
    published: 'Yes',
    last_updated: '2024-05-25T18:00:00Z',
    league_id: '100',
    competition_name: 'Division 1',
    competition_id: '200',
    competition_type: 'League',
    match_type: 'Limited Overs',
    game_type: 'Standard',
    countdown_cricket: 'No',
    match_date: '2024-05-25',
    match_time: '14:00',
    ground_name: 'Test Ground 4',
    ground_id: '304',
    home_team_name: 'Home Team 4',
    home_team_id: '4',
    home_club_name: 'Home Club D',
    home_club_id: '40',
    away_team_name: 'Home Team 1',
    away_team_id: '1',
    away_club_name: 'Home Club A',
    away_club_id: '10',
    umpire_1_name: 'Umpire 6',
    umpire_1_id: '506',
    umpire_2_name: 'Umpire 7',
    umpire_2_id: '507',
    umpire_3_name: '',
    umpire_3_id: '',
    referee_name: '',
    referee_id: '',
    scorer_1_name: 'Scorer 3',
    scorer_1_id: '603',
    scorer_2_name: '',
    scorer_2_id: '',
    toss_won_by_team_id: '4',
    toss: 'field',
    batted_first: '1',
    no_of_overs: '40',
    balls_per_innings: '240',
    no_of_innings: '2',
    result: 'A',
    result_description: 'Home Team 1 won by 7 wickets',
    result_applied_to: '1',
    home_confirmed: 'Yes',
    away_confirmed: 'Yes',
    result_locked: 'Yes',
    scorecard_locked: 'Yes',
    match_notes: '',
    points: [
      {
        team_id: 1,
        game_points: '20',
        penalty_points: '0',
        bonus_points_together: '3',
        bonus_points_batting: '2',
        bonus_points_bowling: '1',
        bonus_points_2nd_innings_together: '0',
      },
    ],
    innings: [
      {
        team_batting_id: '4',
        innings_number: 1,
        extra_byes: '2',
        extra_leg_byes: '1',
        extra_wides: '6',
        extra_no_balls: '1',
        extra_penalty_runs: '0',
        penalties_runs_awarded_in_other_innings: '0',
        total_extras: '10',
        runs: '180',
        wickets: '10',
        overs: '39',
        balls: '3',
        declared: false,
        forfeited_innings: false,
        revised_target_runs: '',
        revised_target_overs: '',
        revised_target_balls: '',
      },
      {
        team_batting_id: '1',
        innings_number: 2,
        extra_byes: '3',
        extra_leg_byes: '2',
        extra_wides: '5',
        extra_no_balls: '2',
        extra_penalty_runs: '0',
        penalties_runs_awarded_in_other_innings: '0',
        total_extras: '12',
        runs: '181',
        wickets: '3',
        overs: '35',
        balls: '4',
        declared: false,
        forfeited_innings: false,
        revised_target_runs: '',
        revised_target_overs: '',
        revised_target_balls: '',
      },
    ],
    league_name: 'Test League',
  },
]

describe('MCP Helper Functions', () => {
  describe('extractUniqueTeams', () => {
    test('should extract unique teams from matches and results', () => {
      const teams = extractUniqueTeams(mockMatches, mockResults)

      expect(teams.length).toBe(4)
      expect(teams).toEqual([
        { team_id: '2', team_name: 'Away Team 2', club_id: '20', club_name: 'Away Club B' },
        { team_id: '1', team_name: 'Home Team 1', club_id: '10', club_name: 'Home Club A' },
        { team_id: '3', team_name: 'Home Team 3', club_id: '30', club_name: 'Home Club C' },
        { team_id: '4', team_name: 'Home Team 4', club_id: '40', club_name: 'Home Club D' },
      ])
    })

    test('should handle empty arrays', () => {
      const teams = extractUniqueTeams([], [])
      expect(teams.length).toBe(0)
    })

    test('should not duplicate teams appearing in both matches and results', () => {
      const teams = extractUniqueTeams(mockMatches, mockResults)
      const teamIds = teams.map((t) => t.team_id)
      const uniqueIds = new Set(teamIds)

      expect(teamIds.length).toBe(uniqueIds.size)
    })

    test('should sort teams alphabetically by name', () => {
      const teams = extractUniqueTeams(mockMatches, mockResults)
      const names = teams.map((t) => t.team_name)

      const sortedNames = [...names].sort()
      expect(names).toEqual(sortedNames)
    })
  })

  describe('filterTeamFixtures', () => {
    test('should filter fixtures for a specific team', () => {
      const fixtures = filterTeamFixtures(mockMatches, '1')

      expect(fixtures.length).toBe(2)
      expect(fixtures[0].match_id).toBe(1001)
      expect(fixtures[1].match_id).toBe(1003)
    })

    test('should include matches where team is home or away', () => {
      const fixturesAsHome = filterTeamFixtures(mockMatches, '1')
      const fixturesAsAway = filterTeamFixtures(mockMatches, '3')

      expect(fixturesAsHome.some((f) => f.home_team_id === '1')).toBe(true)
      expect(fixturesAsAway.some((f) => f.away_team_id === '3')).toBe(true)
    })

    test('should return empty array for non-existent team', () => {
      const fixtures = filterTeamFixtures(mockMatches, '999')
      expect(fixtures.length).toBe(0)
    })

    test('should sort fixtures by date ascending', () => {
      const fixtures = filterTeamFixtures(mockMatches, '1')
      const dates = fixtures.map((f) => new Date(f.match_date).getTime())

      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i - 1])
      }
    })

    test('should only include essential fixture fields', () => {
      const fixtures = filterTeamFixtures(mockMatches, '1')
      const fixture = fixtures[0]

      expect(fixture).toHaveProperty('match_id')
      expect(fixture).toHaveProperty('match_date')
      expect(fixture).toHaveProperty('match_time')
      expect(fixture).toHaveProperty('home_team')
      expect(fixture).toHaveProperty('away_team')
      expect(fixture).toHaveProperty('ground_name')
      expect(fixture).toHaveProperty('competition_name')

      // Should not have umpire/scorer fields
      expect(fixture).not.toHaveProperty('umpire_1_name')
      expect(fixture).not.toHaveProperty('scorer_1_name')
    })
  })

  describe('filterTeamResults', () => {
    test('should filter results for a specific team', () => {
      const results = filterTeamResults(mockResults, '1')

      expect(results.length).toBe(2)
      expect(results[0].match_id).toBe(2002) // More recent first
      expect(results[1].match_id).toBe(2001)
    })

    test('should include score information when available', () => {
      const results = filterTeamResults(mockResults, '1')
      const result = results[0]

      expect(result.home_score).toBeDefined()
      expect(result.away_score).toBeDefined()
      expect(result.home_score).toContain('180/10')
      expect(result.away_score).toContain('181/3')
    })

    test('should sort results by date descending (most recent first)', () => {
      const results = filterTeamResults(mockResults, '1')
      const dates = results.map((r) => new Date(r.match_date).getTime())

      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i - 1])
      }
    })

    test('should return empty array for non-existent team', () => {
      const results = filterTeamResults(mockResults, '999')
      expect(results.length).toBe(0)
    })

    test('should include result description', () => {
      const results = filterTeamResults(mockResults, '1')
      expect(results[0].result_description).toBe('Home Team 1 won by 7 wickets')
      expect(results[1].result_description).toBe('Home Team 1 won by 45 runs')
    })

    test('should not include detailed innings or points data', () => {
      const results = filterTeamResults(mockResults, '1')
      const result = results[0]

      expect(result).not.toHaveProperty('innings')
      expect(result).not.toHaveProperty('points')
      expect(result).not.toHaveProperty('umpire_1_name')
    })
  })

  describe('filterFixturesByDate', () => {
    test('should return all fixtures sorted by date', () => {
      const fixtures = filterFixturesByDate(mockMatches)

      expect(fixtures.length).toBe(3)
      expect(fixtures[0].match_date).toBe('2024-06-15')
      expect(fixtures[1].match_date).toBe('2024-06-22')
      expect(fixtures[2].match_date).toBe('2024-07-01')
    })

    test('should handle empty array', () => {
      const fixtures = filterFixturesByDate([])
      expect(fixtures.length).toBe(0)
    })

    test('should only include streamlined fields', () => {
      const fixtures = filterFixturesByDate(mockMatches)
      const fixture = fixtures[0]

      expect(fixture).toHaveProperty('match_id')
      expect(fixture).toHaveProperty('match_date')
      expect(fixture).toHaveProperty('home_team')
      expect(fixture).toHaveProperty('away_team')
      expect(fixture).not.toHaveProperty('umpire_1_id')
      expect(fixture).not.toHaveProperty('ground_latitude')
    })
  })

  describe('filterResultsByDate', () => {
    test('should return all results sorted by date descending', () => {
      const results = filterResultsByDate(mockResults)

      expect(results.length).toBe(2)
      expect(results[0].match_date).toBe('2024-05-25') // Most recent first
      expect(results[1].match_date).toBe('2024-05-18')
    })

    test('should handle empty array', () => {
      const results = filterResultsByDate([])
      expect(results.length).toBe(0)
    })

    test('should include scores in readable format', () => {
      const results = filterResultsByDate(mockResults)
      const result = results[0]

      expect(result.home_score).toContain('/')
      expect(result.away_score).toContain('/')
      expect(result.home_score).toContain('overs')
    })

    test('should handle results without innings data', () => {
      const resultsWithoutInnings: ResultSummary[] = [
        {
          ...mockResults[0],
          innings: [],
        },
      ]

      const results = filterResultsByDate(resultsWithoutInnings)
      expect(results[0].home_score).toBeUndefined()
      expect(results[0].away_score).toBeUndefined()
    })
  })
})
