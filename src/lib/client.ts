/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance } from 'axios'
import { CompetitionTeamsResponse } from './interface/competitionTeams'
import { CompetitionsResponse } from './interface/competitions'

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

  public getTeamsInComp = async (id: string): Promise<CompetitionTeamsResponse> => {
    return await this.request<CompetitionTeamsResponse>('competition_teams.json', { id })
  }

  public getCompetitions = async (season: string, leagueId: string, competitionType: "divisions"|"cups"): Promise<CompetitionsResponse> => {
    return await this.request<CompetitionsResponse>('competitions.json', {
      season,
      league_id: leagueId,
      competition_type: competitionType
    })
  }
}
