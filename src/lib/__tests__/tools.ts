import { toCamel, toSnake, convertMatchQueryToPCQuery } from '../tools';
import { MatchQuery } from '../interface/general';

describe("Tools methods", () => {
  test('it converts snake case to camel case', () => {
    expect(toCamel('competition_type')).toBe('competitionType')
    expect(toCamel('_competition_type')).toBe('CompetitionType')
    expect(toCamel('test_')).toBe('test_')
    expect(toCamel('league_id')).toBe('leagueId')
  });

  test('it converts camel case to snake case', () => {
    expect(toSnake('competitionType')).toBe('competition_type')
    expect(toSnake('CompetitionType')).toBe('competition_type')
  })

  test('it converts query', () => {
    const testQuery: MatchQuery = {
      teamId: '123',
      fromMatchDate: new Date(2019, 10, 5)
    }
    const convertedQuery = convertMatchQueryToPCQuery(testQuery)
    expect(convertedQuery['team_id']).toBe('123')
    expect(convertedQuery['from_match_date']).toBe('05/10/2019')
  })
})
