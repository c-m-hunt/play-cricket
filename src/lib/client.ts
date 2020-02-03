/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance } from 'axios'
import { CompetitionTeamsResponse } from './interface/competitionTeams'
import { CompetitionsResponse } from './interface/competitions'
import { LeagueTableResponse } from './interface/leagueTable'
import { MatchesResponse } from './interface/matches'
import { MatchDetailResponse } from './interface/matchDetail'
import { MatchQuery, ResultQuery } from './interface/general'
import { convertMatchQueryToPCQuery } from './tools'

export class NotFoundError extends Error {}
export class NotAuthorisedError extends Error {}

export class Client {
  public apiKey: string
  private baseURL = `http://play-cricket.com/api/v2/`
  private http: AxiosInstance
  public constructor(apiKey: string) {
    this.apiKey = apiKey
    this.http = axios.create({
      baseURL: this.baseURL
    })
  }

  private request = async <T>(path: string, params: object): Promise<T> => {
    params = { ...params, api_token: this.apiKey }
    try {
      const response = await this.http.get(path, {
        params
      })
      return response.data
    } catch (ex) {
      if (ex.response.status === 404) {
        throw new NotFoundError('Data not found')
      }
      if (ex.response.status === 401) {
        throw new NotAuthorisedError(ex.message)
      }
    }
  }

  public getTeamsInComp = async (id: number): Promise<CompetitionTeamsResponse> => {
    return await this.request<CompetitionTeamsResponse>('competition_teams.json', { id })
  }

  public getCompetitions = async (season: number, leagueId: number, competitionType: "divisions"|"cups"): Promise<CompetitionsResponse> => {
    return await this.request<CompetitionsResponse>('competitions.json', {
      season,
      league_id: leagueId,
      competition_type: competitionType
    })
  }

  public getLeagueTable = async (divId: number): Promise<LeagueTableResponse> => {
    return await this.request<LeagueTableResponse>('league_table.json', {
      division_id: divId
    })
  }

  public getMatches = async (
    siteId: number,
    season: number,
    query: MatchQuery | null = null,
  ): Promise<MatchesResponse> => {
    return this.getMatchesEndpoint<MatchesResponse, MatchQuery>(
      'matches.json',
      siteId,
      season,
      query
    )
  }

  public getResults = async (
    siteId: number,
    season: number,
    query: ResultQuery | null = null,
  ): Promise<MatchesResponse> => {
    return this.getMatchesEndpoint<MatchesResponse, ResultQuery>(
      'result_summary.json',
      siteId,
      season,
      query
    )
  }

  private getMatchesEndpoint = async <T, U>(
    endpoint: string,
    siteId: number,
    season: number,
    query: U | null = null,
  ): Promise<T> => {
    let pcQuery = {}
    if (query) {
      pcQuery = convertMatchQueryToPCQuery(query)
    }
    return await this.request<T>(endpoint, {
      site_id: siteId,
      season,
      ...pcQuery
    })
  }

  public getMatchDetail = async (matchId: number): Promise<MatchDetailResponse> => {
    return await this.request<MatchDetailResponse>('match_detail.json', {
      match_id: matchId
    })
  }

}
