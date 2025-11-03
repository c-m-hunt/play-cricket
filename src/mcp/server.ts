#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'
import { encode as encodeToon } from '@toon-format/toon'
import { Client } from '../lib/client.js'
import type { MatchQuery, ResultQuery } from '../lib/interface/general.js'
import {
  extractUniqueTeams,
  filterFixturesByDate,
  filterResultsByDate,
  filterTeamFixtures,
  filterTeamResults,
} from './helpers.js'

/**
 * MCP Server for Play Cricket API
 *
 * This server exposes the Play Cricket API through the Model Context Protocol,
 * allowing AI assistants to fetch cricket data.
 */

// Get API key from environment variable
const API_KEY = process.env.PLAY_CRICKET_API_KEY
const USE_TOON_FORMAT = process.env.MCP_OUTPUT_TOON === '1'

if (!API_KEY) {
  console.error('Error: PLAY_CRICKET_API_KEY environment variable is required')
  process.exit(1)
}

// Create Play Cricket client
const client = new Client(API_KEY)

/**
 * Format data for output based on MCP_OUTPUT_TOON environment variable
 * If MCP_OUTPUT_TOON=1, returns TOON format, otherwise JSON
 */
function formatOutput(data: unknown): string {
  if (USE_TOON_FORMAT) {
    return encodeToon(data, {
      delimiter: '\t', // Tab delimiter for better token efficiency
      indent: 2,
    })
  }
  return JSON.stringify(data, null, 2)
}

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'get_teams_in_competition',
    description:
      'Get all teams participating in a specific competition. Returns team information including names, IDs, and other details.',
    inputSchema: {
      type: 'object',
      properties: {
        competitionId: {
          type: 'number',
          description: 'The ID of the competition',
        },
      },
      required: ['competitionId'],
    },
  },
  {
    name: 'get_competitions',
    description:
      'Get competitions for a specific season and league. Can filter by competition type (divisions or cups).',
    inputSchema: {
      type: 'object',
      properties: {
        season: {
          type: 'number',
          description: 'The season year (e.g., 2024)',
        },
        leagueId: {
          type: 'number',
          description: 'The ID of the league',
        },
        competitionType: {
          type: 'string',
          enum: ['divisions', 'cups'],
          description: 'Type of competition to retrieve',
        },
      },
      required: ['season', 'leagueId', 'competitionType'],
    },
  },
  {
    name: 'get_league_table',
    description:
      'Get the league table/standings for a specific division. Shows team rankings, points, wins, losses, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        divisionId: {
          type: 'number',
          description: 'The ID of the division',
        },
      },
      required: ['divisionId'],
    },
  },
  {
    name: 'get_matches',
    description:
      'Get matches for a specific site and season. Can be filtered by team, division, dates, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'number',
          description: 'The site ID',
        },
        season: {
          type: 'number',
          description: 'The season year',
        },
        query: {
          type: 'object',
          description: 'Optional filters for matches',
          properties: {
            teamId: {
              type: 'string',
              description: 'Filter by team ID',
            },
            divisionId: {
              type: 'string',
              description: 'Filter by division ID',
            },
            fromEntryDate: {
              type: 'string',
              description: 'Filter matches from this date (ISO format)',
            },
            toEntryDate: {
              type: 'string',
              description: 'Filter matches to this date (ISO format)',
            },
            fromDate: {
              type: 'string',
              description: 'Filter matches from this match date (ISO format)',
            },
            toDate: {
              type: 'string',
              description: 'Filter matches to this match date (ISO format)',
            },
          },
        },
      },
      required: ['siteId', 'season'],
    },
  },
  {
    name: 'get_results',
    description:
      'Get result summaries for a specific site and season. Similar to get_matches but returns summary information.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'number',
          description: 'The site ID',
        },
        season: {
          type: 'number',
          description: 'The season year',
        },
        query: {
          type: 'object',
          description: 'Optional filters for results',
          properties: {
            teamId: {
              type: 'string',
              description: 'Filter by team ID',
            },
            divisionId: {
              type: 'string',
              description: 'Filter by division ID',
            },
            fromEntryDate: {
              type: 'string',
              description: 'Filter results from this date (ISO format)',
            },
            toEntryDate: {
              type: 'string',
              description: 'Filter results to this date (ISO format)',
            },
            fromDate: {
              type: 'string',
              description: 'Filter results from this match date (ISO format)',
            },
            toDate: {
              type: 'string',
              description: 'Filter results to this match date (ISO format)',
            },
          },
        },
      },
      required: ['siteId', 'season'],
    },
  },
  {
    name: 'get_match_detail',
    description:
      'Get detailed information about a specific match including scorecard, players, and statistics.',
    inputSchema: {
      type: 'object',
      properties: {
        matchId: {
          type: 'number',
          description: 'The ID of the match',
        },
      },
      required: ['matchId'],
    },
  },
  {
    name: 'get_club_teams',
    description:
      'Get a list of all teams for a club in a specific season. Extracts unique teams from both fixtures and results. Returns minimal data optimized for LLMs.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'number',
          description: 'The site ID of the club',
        },
        season: {
          type: 'number',
          description: 'The season year (e.g., 2024)',
        },
      },
      required: ['siteId', 'season'],
    },
  },
  {
    name: 'get_team_fixtures',
    description:
      'Get upcoming fixtures for a specific team. Returns streamlined data including only essential match information without officials, umpires, or detailed metadata. Optimized for LLMs.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'number',
          description: 'The site ID',
        },
        season: {
          type: 'number',
          description: 'The season year',
        },
        teamId: {
          type: 'string',
          description: 'The team ID to get fixtures for',
        },
        fromDate: {
          type: 'string',
          description: 'Optional: Filter fixtures from this date (ISO format YYYY-MM-DD)',
        },
        toDate: {
          type: 'string',
          description: 'Optional: Filter fixtures to this date (ISO format YYYY-MM-DD)',
        },
      },
      required: ['siteId', 'season', 'teamId'],
    },
  },
  {
    name: 'get_team_results',
    description:
      'Get completed match results for a specific team. Returns brief summaries with scores and outcomes, excluding detailed innings data, officials, and metadata. Optimized for LLMs.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'number',
          description: 'The site ID',
        },
        season: {
          type: 'number',
          description: 'The season year',
        },
        teamId: {
          type: 'string',
          description: 'The team ID to get results for',
        },
        fromDate: {
          type: 'string',
          description: 'Optional: Filter results from this date (ISO format YYYY-MM-DD)',
        },
        toDate: {
          type: 'string',
          description: 'Optional: Filter results to this date (ISO format YYYY-MM-DD)',
        },
      },
      required: ['siteId', 'season', 'teamId'],
    },
  },
  {
    name: 'get_fixtures_by_date',
    description:
      'Get all fixtures within a date range for a site. Returns streamlined fixture information without officials or detailed metadata. Useful for finding matches on specific dates. Optimized for LLMs.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'number',
          description: 'The site ID',
        },
        season: {
          type: 'number',
          description: 'The season year',
        },
        fromDate: {
          type: 'string',
          description: 'Filter fixtures from this date (ISO format YYYY-MM-DD)',
        },
        toDate: {
          type: 'string',
          description: 'Filter fixtures to this date (ISO format YYYY-MM-DD)',
        },
      },
      required: ['siteId', 'season', 'fromDate', 'toDate'],
    },
  },
  {
    name: 'get_results_by_date',
    description:
      'Get all match results within a date range for a site. Returns brief summaries with scores and outcomes, excluding detailed data. Useful for reviewing results over a period. Optimized for LLMs.',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'number',
          description: 'The site ID',
        },
        season: {
          type: 'number',
          description: 'The season year',
        },
        fromDate: {
          type: 'string',
          description: 'Filter results from this date (ISO format YYYY-MM-DD)',
        },
        toDate: {
          type: 'string',
          description: 'Filter results to this date (ISO format YYYY-MM-DD)',
        },
      },
      required: ['siteId', 'season', 'fromDate', 'toDate'],
    },
  },
]

// Helper function to parse date strings to Date objects
function parseDateQuery(
  query: Record<string, unknown> | undefined | null,
): MatchQuery | ResultQuery | null {
  if (!query) return null

  const parsed: Record<string, unknown> = { ...query }

  // Convert date strings to Date objects
  if (typeof query.fromEntryDate === 'string') {
    parsed.fromEntryDate = new Date(query.fromEntryDate)
  }
  if (typeof query.toEntryDate === 'string') {
    parsed.toEntryDate = new Date(query.toEntryDate)
  }
  if (typeof query.fromDate === 'string') {
    parsed.fromDate = new Date(query.fromDate)
  }
  if (typeof query.toDate === 'string') {
    parsed.toDate = new Date(query.toDate)
  }

  return parsed as MatchQuery | ResultQuery
}

// Create and configure the server
const server = new Server(
  {
    name: 'play-cricket-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  try {
    const { name, arguments: args } = request.params

    switch (name) {
      case 'get_teams_in_competition': {
        const result = await client.getTeamsInComp(args.competitionId as number)
        return {
          content: [
            {
              type: 'text',
              text: formatOutput(result),
            },
          ],
        }
      }

      case 'get_competitions': {
        const result = await client.getCompetitions(
          args.season as number,
          args.leagueId as number,
          args.competitionType as 'divisions' | 'cups',
        )
        return {
          content: [
            {
              type: 'text',
              text: formatOutput(result),
            },
          ],
        }
      }

      case 'get_league_table': {
        const result = await client.getLeagueTable(args.divisionId as number)
        return {
          content: [
            {
              type: 'text',
              text: formatOutput(result),
            },
          ],
        }
      }

      case 'get_matches': {
        const query = parseDateQuery(args.query as Record<string, unknown> | undefined)
        const result = await client.getMatches(args.siteId as number, args.season as number, query)
        return {
          content: [
            {
              type: 'text',
              text: formatOutput(result),
            },
          ],
        }
      }

      case 'get_results': {
        const query = parseDateQuery(args.query as Record<string, unknown> | undefined)
        const result = await client.getResults(args.siteId as number, args.season as number, query)

        // Remove innings data to reduce context size
        const filteredResult = {
          ...result,
          result_summary: result.result_summary?.map((summary) => {
            const { innings, ...summaryWithoutInnings } = summary
            return summaryWithoutInnings
          }),
        }

        return {
          content: [
            {
              type: 'text',
              text: formatOutput(filteredResult),
            },
          ],
        }
      }

      case 'get_match_detail': {
        const result = await client.getMatchDetail(args.matchId as number)
        return {
          content: [
            {
              type: 'text',
              text: formatOutput(result),
            },
          ],
        }
      }

      case 'get_club_teams': {
        // Fetch both matches and results to get all teams
        const [matchesResponse, resultsResponse] = await Promise.all([
          client.getMatches(args.siteId as number, args.season as number),
          client.getResults(args.siteId as number, args.season as number),
        ])

        const teams = extractUniqueTeams(
          matchesResponse.matches || [],
          resultsResponse.result_summary || [],
        )

        return {
          content: [
            {
              type: 'text',
              text: formatOutput({ teams, count: teams.length }),
            },
          ],
        }
      }

      case 'get_team_fixtures': {
        const query = parseDateQuery({
          fromDate: args.fromDate,
          toDate: args.toDate,
        })

        const matchesResponse = await client.getMatches(
          args.siteId as number,
          args.season as number,
          query,
        )

        const fixtures = filterTeamFixtures(matchesResponse.matches || [], args.teamId as string)

        return {
          content: [
            {
              type: 'text',
              text: formatOutput({ fixtures, count: fixtures.length }),
            },
          ],
        }
      }

      case 'get_team_results': {
        const query = parseDateQuery({
          fromDate: args.fromDate,
          toDate: args.toDate,
        })

        const resultsResponse = await client.getResults(
          args.siteId as number,
          args.season as number,
          query,
        )

        const results = filterTeamResults(
          resultsResponse.result_summary || [],
          args.teamId as string,
        )

        return {
          content: [
            {
              type: 'text',
              text: formatOutput({ results, count: results.length }),
            },
          ],
        }
      }

      case 'get_fixtures_by_date': {
        const query = parseDateQuery({
          fromDate: args.fromDate,
          toDate: args.toDate,
        })

        const matchesResponse = await client.getMatches(
          args.siteId as number,
          args.season as number,
          query,
        )

        const fixtures = filterFixturesByDate(matchesResponse.matches || [])

        return {
          content: [
            {
              type: 'text',
              text: formatOutput({ fixtures, count: fixtures.length }),
            },
          ],
        }
      }

      case 'get_results_by_date': {
        const query = parseDateQuery({
          fromDate: args.fromDate,
          toDate: args.toDate,
        })

        const resultsResponse = await client.getResults(
          args.siteId as number,
          args.season as number,
          query,
        )

        const results = filterResultsByDate(resultsResponse.result_summary || [])

        return {
          content: [
            {
              type: 'text',
              text: formatOutput({ results, count: results.length }),
            },
          ],
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    }
  }
})

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Play Cricket MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
