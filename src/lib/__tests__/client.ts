import { Client, NotFoundError } from '../client';

const apiKey = 'abc123'

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosInst = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({ data: "test" })
mockedAxiosInst.create.mockReturnValue(mockedAxios)

describe("Play Cricket client class", () => {

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
})

// describe("Play Cricket live data client class", () => {
//   test('it returns some basic data', async () => {
//     const c = new Client(apiKey)
//     const data = await c.getTeamsInComp('87298')
//     expect(data).toBe('test')
//   })
// })

