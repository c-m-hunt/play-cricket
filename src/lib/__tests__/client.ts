import { Client, NotFoundError, NotAuthorisedError } from '../client';

const apiKey = 'abc123'

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosInst = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({ data: "test" })
mockedAxiosInst.create.mockReturnValue(mockedAxios)

describe("Play Cricket client class", () => {
  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  test('Client class construction', () => {
    const c = new Client(apiKey)
    expect(c.apiKey).toBe(apiKey);
  });
  
  test('it returns some basic data', async () => {
    const c = new Client(apiKey)
    const data = await c.getTeamsInComp(87298)
    expect(mockedAxios.get).toBeCalledTimes(1)
    expect(data).toBe('test')
  })

  test('all methods call request', async () => {
    const c = new Client(apiKey)
    const data1 = await c.getTeamsInComp(87298)
    const data2 = await c.getLeagueTable(123)
    const data3 = await c.getMatches(1234, 2020)
    const data4 = await c.getMatchDetail(1234)
    const data5 = await c.getResults(1234, 2020)
    expect(mockedAxios.get).toBeCalledTimes(5)
    expect(data1).toBe('test')
    expect(data2).toBe('test')
    expect(data3).toBe('test')
    expect(data4).toBe('test')
    expect(data5).toBe('test')
  })

  test('it calls methods with converted queries', async () => {
    const c = new Client(apiKey)
    await c.getMatches(1234, 2020, {
      divisionId: "abc123",
      fromEntryDate: new Date(2020, 3, 5)
    })
    expect(mockedAxios.get).toBeCalledTimes(1)
    expect(mockedAxios.get).toBeCalledWith(expect.any(String), {
      params: {
        site_id: 1234,
        season: 2020,
        division_id: "abc123",
        from_entry_date: "05/03/2020",
        api_token: apiKey
      }
    })
  })

  test('handles 404', async (done) => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.reject({
        response: {status: 404}
      })
    })
    const t = async () => {
      const c = new Client(apiKey)
      await c.getCompetitions(2018, 7300000, "cups")
    }
    await expect(t()).rejects.toThrow(NotFoundError)
    done()
  })

  test('handles 401', async (done) => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.reject({
        response: {status: 401}
      })
    })
    const t = async () => {
      const c = new Client(apiKey)
      await c.getCompetitions(2018, 7300000, "cups")
    }
    await expect(t()).rejects.toThrow(NotAuthorisedError)
    done()
  })
})
