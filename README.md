# Play Cricket Client

Client library and MCP server for Play Cricket data (Bun/Node.js)

## Features

- 🏏 **Full Play Cricket API Coverage** - Access teams, competitions, matches, and detailed statistics
- 🔌 **MCP Server** - Model Context Protocol server for AI assistants (Claude, Cline, etc.)
- ⚡ **Bun Optimized** - Built with Bun for maximum performance
- 📦 **TypeScript** - Full type safety and excellent IDE support
- 🧪 **Well Tested** - Comprehensive test coverage

## Prerequisites

This library is optimized for [Bun](https://bun.sh/) runtime. To install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Install

```bash
bun add play-cricket-client
```

Or with npm:
```bash
npm install play-cricket-client
```

Or with yarn:
```bash
yarn add play-cricket-client
```

## Import

ES Modules (recommended):
```typescript
import { Client } from "play-cricket-client";
```

CommonJS:
```javascript
const { Client } = require("play-cricket-client");
```

## Usage

### Basic Usage

```typescript
const client = new Client(apiKey);

// Get teams in a competition
const teams = await client.getTeamsInComp(12345);

// Get league table
const table = await client.getLeagueTable(87298);

// Get matches with filters
const matches = await client.getMatches(1234, 2024, {
  teamId: '123456',
  fromDate: new Date('2024-05-01')
});

// Get match details
const matchDetail = await client.getMatchDetail(789012);
```

### Available Methods

- `getTeamsInComp(competitionId: number)` - Get teams in a competition
- `getCompetitions(season: number, leagueId: number, type: 'divisions' | 'cups')` - Get competitions
- `getLeagueTable(divisionId: number)` - Get league standings
- `getMatches(siteId: number, season: number, query?: MatchQuery)` - Get matches
- `getResults(siteId: number, season: number, query?: ResultQuery)` - Get result summaries
- `getMatchDetail(matchId: number)` - Get detailed match information

## MCP Server

This package includes a Model Context Protocol (MCP) server that allows AI assistants like Claude Desktop to access Play Cricket data.

### Features

- 🔌 **11 Tools** - Access all Play Cricket data through structured tools
- 🎯 **Optimized for LLMs** - 5 specialized tools return minimal, focused data
- 🚀 **Fast** - Streamlined responses reduce token usage and improve speed
- 📊 **Comprehensive** - Full API coverage plus smart filtering and aggregation
- 🎒 **TOON Format Support** - Optional 30-60% token reduction with TOON output format

### Quick Start

1. Install globally:
```bash
npm install -g play-cricket-client
```

2. Configure your MCP client (e.g., Claude Desktop):
```json
{
  "mcpServers": {
    "play-cricket": {
      "command": "play-cricket-mcp",
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here",
        "MCP_OUTPUT_TOON": "1"
      }
    }
  }
}
```

3. Restart your MCP client and start asking about cricket data!

**Optional:** Set `MCP_OUTPUT_TOON=1` to enable [TOON format](https://github.com/toon-format/toon) for 30-60% token reduction (especially effective with tabular data).

### Available Tools

**Core API Tools** (full data):
- `get_teams_in_competition`, `get_competitions`, `get_league_table`
- `get_matches`, `get_results`, `get_match_detail`

**Optimized Tools** (LLM-friendly, minimal data):
- `get_club_teams` - List all teams for a club
- `get_team_fixtures` - Upcoming matches for a team
- `get_team_results` - Results with brief scores
- `get_fixtures_by_date`, `get_results_by_date` - Date-based queries

� **Tip:** The optimized tools return 60-80% less data while keeping all essential information, making them perfect for conversational AI.

�📖 **Full documentation:** 
- [MCP.md](./MCP.md) - Complete MCP server setup and usage
- [MCP-QUICKSTART.md](./MCP-QUICKSTART.md) - Quick reference card

## Development

This project uses Bun for development. To get started:

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Watch mode
bun test --watch

# Build the project
bun run build

# Lint code
bun run lint

# Lint and fix auto-fixable issues
bun run lint:fix

# Format code
bun run format

# Run full check (lint + format)
bun run check

# Run full check and fix
bun run check:fix
```

