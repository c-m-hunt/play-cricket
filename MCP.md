# Play Cricket MCP Server

Model Context Protocol (MCP) server for the Play Cricket API. This server allows AI assistants to access cricket data through standardized MCP tools.

## Quick Start

**For end users:**
```bash
npm install -g play-cricket-client
```

**For local development:**
```bash
git clone https://github.com/c-m-hunt/play-cricket.git
cd play-cricket
bun install && bun run build
```

Then see [Development/Local Repository Configuration](#developmentlocal-repository-configuration) for setup instructions.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI assistants to securely access external data sources and tools. This server exposes Play Cricket API functionality as MCP tools.

## Prerequisites

- Node.js 18+ or Bun runtime
- Play Cricket API key (get one from [Play Cricket](https://www.play-cricket.com/api))

## Installation

### Global Installation

```bash
npm install -g play-cricket-client
```

### Local Installation

```bash
npm install play-cricket-client
```

## Configuration

### Environment Variables

**Required:**
- `PLAY_CRICKET_API_KEY` - Your Play Cricket API key

**Optional:**
- `MCP_OUTPUT_TOON` - Set to `1` to enable TOON format output (default: JSON)

```bash
export PLAY_CRICKET_API_KEY="your-api-key-here"
export MCP_OUTPUT_TOON="1"  # Optional: Enable TOON format for 30-60% token savings
```

#### TOON Format

[TOON (Token-Oriented Object Notation)](https://github.com/toon-format/toon) is a compact data format designed for LLMs that reduces token usage by 30-60% compared to JSON. When `MCP_OUTPUT_TOON=1`, all MCP tool responses are returned in TOON format instead of JSON.

**Benefits:**
- 🎯 30-60% fewer tokens than JSON
- 📊 Especially efficient for tabular data (fixtures, results, teams)
- 🤖 LLM-friendly with explicit lengths and field names
- ⚡ Tab-delimited format for maximum efficiency

**Example comparison:**

JSON (84 tokens):
```json
{
  "teams": [
    { "team_id": "1", "team_name": "Team A", "club_name": "Club X" },
    { "team_id": "2", "team_name": "Team B", "club_name": "Club Y" }
  ]
}
```

TOON (52 tokens, 38% reduction):
```toon
teams[2	]{team_id	team_name	club_name}:
  1	Team A	Club X
  2	Team B	Club Y
```

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop, Cline, etc.):

**Standard JSON output:**
```json
{
  "mcpServers": {
    "play-cricket": {
      "command": "play-cricket-mcp",
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**With TOON format (30-60% fewer tokens):**
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

Or if installed locally in a project:

```json
{
  "mcpServers": {
    "play-cricket": {
      "command": "npx",
      "args": ["play-cricket-mcp"],
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Development/Local Repository Configuration

If you've cloned the repository and want to use the MCP server during development:

**Option 1: Using Bun (Recommended for development)**

```json
{
  "mcpServers": {
    "play-cricket": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/play-cricket/src/mcp/server.ts"],
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Option 2: Using the built version**

First, build the project:
```bash
cd /path/to/play-cricket
bun install
bun run build
```

Then configure your MCP client:
```json
{
  "mcpServers": {
    "play-cricket": {
      "command": "node",
      "args": ["/absolute/path/to/play-cricket/dist/mcp/server.js"],
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Option 3: Using npm link for global development**

From the repository directory:
```bash
cd /path/to/play-cricket
bun install
bun run build
npm link
```

Then use the global installation config:
```json
{
  "mcpServers": {
    "play-cricket": {
      "command": "play-cricket-mcp",
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Finding the configuration file:**

The MCP configuration file location depends on your client:

- **Claude Desktop (macOS)**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Claude Desktop (Windows)**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Cline (VS Code)**: Settings → Extensions → Cline → MCP Settings

## Available Tools

The MCP server exposes the following tools:

### 1. get_teams_in_competition

Get all teams participating in a specific competition.

**Parameters:**
- `competitionId` (number, required): The ID of the competition

**Example:**
```json
{
  "competitionId": 12345
}
```

### 2. get_competitions

Get competitions for a specific season and league.

**Parameters:**
- `season` (number, required): The season year (e.g., 2024)
- `leagueId` (number, required): The ID of the league
- `competitionType` (string, required): Type of competition - either "divisions" or "cups"

**Example:**
```json
{
  "season": 2024,
  "leagueId": 7300000,
  "competitionType": "divisions"
}
```

### 3. get_league_table

Get the league table/standings for a specific division.

**Parameters:**
- `divisionId` (number, required): The ID of the division

**Example:**
```json
{
  "divisionId": 87298
}
```

### 4. get_matches

Get matches for a specific site and season with optional filters.

**Parameters:**
- `siteId` (number, required): The site ID
- `season` (number, required): The season year
- `query` (object, optional): Filter options
  - `teamId` (string): Filter by team ID
  - `divisionId` (string): Filter by division ID
  - `fromEntryDate` (string): Filter from this entry date (ISO format)
  - `toEntryDate` (string): Filter to this entry date (ISO format)
  - `fromDate` (string): Filter from this match date (ISO format)
  - `toDate` (string): Filter to this match date (ISO format)

**Example:**
```json
{
  "siteId": 1234,
  "season": 2024,
  "query": {
    "teamId": "123456",
    "fromDate": "2024-05-01"
  }
}
```

### 5. get_results

Get result summaries for a specific site and season.

**Parameters:** Same as `get_matches`

### 6. get_match_detail

Get detailed information about a specific match.

**Parameters:**
- `matchId` (number, required): The ID of the match

**Example:**
```json
{
  "matchId": 789012
}
```

---

## Optimized Tools for LLMs

The following tools are specifically designed to return minimal, focused data that's ideal for LLM consumption. They filter out unnecessary fields like umpire IDs, scorer details, coordinates, and other metadata that isn't typically needed for conversational queries.

### 7. get_club_teams

Get a list of all teams for a club in a specific season. Extracts unique teams from both fixtures and results.

**Parameters:**
- `siteId` (number, required): The site ID of the club
- `season` (number, required): The season year (e.g., 2024)

**Returns:** Minimal team data - only team_id, team_name, club_id, club_name

**Example:**
```json
{
  "siteId": 1234,
  "season": 2024
}
```

**Use cases:**
- "What teams does this club have?"
- "List all teams for site 1234 in 2024"

### 8. get_team_fixtures

Get upcoming fixtures for a specific team with streamlined data.

**Parameters:**
- `siteId` (number, required): The site ID
- `season` (number, required): The season year
- `teamId` (string, required): The team ID to get fixtures for
- `fromDate` (string, optional): Filter from this date (ISO format YYYY-MM-DD)
- `toDate` (string, optional): Filter to this date (ISO format YYYY-MM-DD)

**Returns:** Essential match info only - date, time, teams, ground, competition (no officials, no metadata)

**Example:**
```json
{
  "siteId": 1234,
  "season": 2024,
  "teamId": "123456",
  "fromDate": "2024-06-01",
  "toDate": "2024-08-31"
}
```

**Use cases:**
- "When does team 123456 play next?"
- "Show fixtures for team X in July"

### 9. get_team_results

Get completed match results for a specific team with brief summaries.

**Parameters:**
- `siteId` (number, required): The site ID
- `season` (number, required): The season year
- `teamId` (string, required): The team ID to get results for
- `fromDate` (string, optional): Filter from this date (ISO format YYYY-MM-DD)
- `toDate` (string, optional): Filter to this date (ISO format YYYY-MM-DD)

**Returns:** Result summaries with scores and outcomes (no detailed innings, no officials)

**Example:**
```json
{
  "siteId": 1234,
  "season": 2024,
  "teamId": "123456"
}
```

**Use cases:**
- "How did team X do this season?"
- "Show me team Y's recent results"
- "What was the result of team Z's last match?"

### 10. get_fixtures_by_date

Get all fixtures within a date range for a site.

**Parameters:**
- `siteId` (number, required): The site ID
- `season` (number, required): The season year
- `fromDate` (string, required): Filter from this date (ISO format YYYY-MM-DD)
- `toDate` (string, required): Filter to this date (ISO format YYYY-MM-DD)

**Returns:** Streamlined fixture list (no officials, no metadata)

**Example:**
```json
{
  "siteId": 1234,
  "season": 2024,
  "fromDate": "2024-06-15",
  "toDate": "2024-06-22"
}
```

**Use cases:**
- "What matches are scheduled this weekend?"
- "Show all fixtures in July"

### 11. get_results_by_date

Get all match results within a date range for a site.

**Parameters:**
- `siteId` (number, required): The site ID
- `season` (number, required): The season year
- `fromDate` (string, required): Filter from this date (ISO format YYYY-MM-DD)
- `toDate` (string, required): Filter to this date (ISO format YYYY-MM-DD)

**Returns:** Brief result summaries (no detailed data)

**Example:**
```json
{
  "siteId": 1234,
  "season": 2024,
  "fromDate": "2024-05-01",
  "toDate": "2024-05-31"
}
```

**Use cases:**
- "What were the results last weekend?"
- "Show all May results"

---

## Tool Selection Guide

**Use the optimized tools (7-11) when:**
- Building conversational interfaces
- Token limits are a concern
- You only need core match/team information
- Working with LLMs that need concise data

**Use the original tools (1-6) when:**
- You need complete API responses
- Building comprehensive reports
- Accessing detailed metadata (officials, coordinates, etc.)
- Using the raw API data for further processing

## Development

### Running the Server Locally

#### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/c-m-hunt/play-cricket.git
cd play-cricket

# Install dependencies
bun install

# Build the project (includes MCP server)
bun run build
```

#### Step 2: Configure Your MCP Client

Choose one of the configuration methods from the [Development/Local Repository Configuration](#developmentlocal-repository-configuration) section above.

For quick testing, use Option 1 (running directly with Bun):

```json
{
  "mcpServers": {
    "play-cricket-dev": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/play-cricket/src/mcp/server.ts"],
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace `/absolute/path/to/play-cricket` with the actual path where you cloned the repository.

#### Step 3: Test the Server

**Option A: Test in your MCP client**
- Restart your MCP client (Claude Desktop, Cline, etc.)
- Ask questions like "Get teams in competition 12345"

**Option B: Test with MCP Inspector**

You can test the server using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
# Test with the built version
export PLAY_CRICKET_API_KEY="your-api-key-here"
npx @modelcontextprotocol/inspector node dist/mcp/server.js

# Or test directly with source (requires Bun)
export PLAY_CRICKET_API_KEY="your-api-key-here"
npx @modelcontextprotocol/inspector bun run src/mcp/server.ts
```

**Option C: Test standalone**

```bash
# Set your API key
export PLAY_CRICKET_API_KEY="your-api-key-here"

# Run the MCP server (listens on stdio)
bun run mcp

# Or run directly
node dist/mcp/server.js
```

Note: The server runs on stdio, so you'll need an MCP client or the inspector to interact with it.

### Making Changes

When developing the MCP server:

1. Make changes to `src/mcp/server.ts`
2. Rebuild: `bun run build:mcp`
3. Test your changes
4. Run tests: `bun test`
5. Check linting: `bun run lint`

## Usage Examples

Once configured in your MCP client (like Claude Desktop), you can ask questions like:

- "Get the teams in competition 12345"
- "Show me the league table for division 87298"
- "Find all matches for site 1234 in the 2024 season"
- "Get detailed information for match 789012"

The AI assistant will automatically call the appropriate MCP tools to fetch the data.

## Error Handling

The server includes error handling for common scenarios:

- **Missing API Key**: Server will not start without `PLAY_CRICKET_API_KEY`
- **404 Not Found**: Returns error when data doesn't exist
- **401 Unauthorized**: Returns error for invalid API key
- **Invalid Parameters**: Returns error for malformed requests

## Troubleshooting

### Server doesn't start

**Problem**: Error "PLAY_CRICKET_API_KEY environment variable is required"

**Solution**: Make sure your API key is set in the MCP configuration:
```json
{
  "mcpServers": {
    "play-cricket": {
      "command": "play-cricket-mcp",
      "env": {
        "PLAY_CRICKET_API_KEY": "your-actual-api-key"
      }
    }
  }
}
```

### Tools not appearing in MCP client

**Problem**: Play Cricket tools don't show up in your MCP client

**Solutions**:
1. Restart your MCP client completely (not just reload)
2. Check the MCP client logs for connection errors
3. Verify the configuration file path is correct for your client
4. Test the server with MCP Inspector: `npx @modelcontextprotocol/inspector play-cricket-mcp`

### Local development: Command not found

**Problem**: When using the local repository, you get "command not found" errors

**Solution**: Use absolute paths in your MCP configuration:
```json
{
  "mcpServers": {
    "play-cricket-dev": {
      "command": "node",
      "args": ["/Users/yourname/projects/play-cricket/dist/mcp/server.js"],
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Local development: Module not found

**Problem**: Error "Cannot find module" when running locally

**Solution**: Make sure you've built the project:
```bash
cd /path/to/play-cricket
bun install
bun run build
```

### API returns 401 errors

**Problem**: All API calls return 401 Unauthorized

**Solution**: Your API key is invalid or expired. Get a new one from [Play Cricket](https://www.play-cricket.com/api) and update your configuration.

### Finding MCP client logs

**Claude Desktop**:
- macOS: `~/Library/Logs/Claude/mcp*.log`
- Windows: `%APPDATA%\Claude\logs\mcp*.log`

**Cline (VS Code)**:
- Check the VS Code Output panel → Select "Cline" from dropdown

## License

ISC

## Links

- [Play Cricket API Documentation](https://www.play-cricket.com/api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
