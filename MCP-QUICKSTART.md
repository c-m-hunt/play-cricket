# Play Cricket MCP Server - Quick Reference

## Installation & Setup

### Option 1: Global Installation (Recommended for Users)

```bash
npm install -g play-cricket-client
```

**Claude Desktop Config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
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
💡 **Tip:** Set `MCP_OUTPUT_TOON=1` for 30-60% fewer tokens!
```

### Option 2: Local Development (Developers)

```bash
git clone https://github.com/c-m-hunt/play-cricket.git
cd play-cricket
bun install
bun run build
```

**Claude Desktop Config** (replace `/path/to/play-cricket` with actual path):

**Method A - Direct source (Bun required):**
```json
{
  "mcpServers": {
    "play-cricket-dev": {
      "command": "bun",
      "args": ["run", "/path/to/play-cricket/src/mcp/server.ts"],
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Method B - Built version (Node.js):**
```json
{
  "mcpServers": {
    "play-cricket-dev": {
      "command": "node",
      "args": ["/path/to/play-cricket/dist/mcp/server.js"],
      "env": {
        "PLAY_CRICKET_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Method C - npm link (Global development):**
```bash
cd /path/to/play-cricket
npm link
```
Then use the global installation config above.

## Available Tools

### Core API Tools (Full Data)
| Tool | Description |
|------|-------------|
| `get_teams_in_competition` | Get teams in a competition |
| `get_competitions` | Get competitions by season/league |
| `get_league_table` | Get league standings |
| `get_matches` | Get matches with optional filters |
| `get_results` | Get result summaries |
| `get_match_detail` | Get detailed match information |

### Optimized Tools (LLM-Friendly, Minimal Data)
| Tool | Description |
|------|-------------|
| `get_club_teams` | Get all teams for a club in a season |
| `get_team_fixtures` | Get fixtures for a specific team |
| `get_team_results` | Get results for a specific team |
| `get_fixtures_by_date` | Get all fixtures in a date range |
| `get_results_by_date` | Get all results in a date range |

💡 **Tip:** Use optimized tools for conversational queries - they return less data and are faster!

## Example Usage

Ask your AI assistant:
- "What teams does club 1234 have in 2024?"
- "Show me fixtures for team 123456 this month"
- "What were the results for team X in July?"
- "Get the league table for division 87298"
- "Find all matches on June 15, 2024"

## Development Commands

```bash
# Build everything
bun run build

# Build MCP server only
bun run build:mcp

# Run tests
bun test

# Run MCP server directly
bun run mcp

# Test with MCP Inspector
export PLAY_CRICKET_API_KEY="your-key"
npx @modelcontextprotocol/inspector node dist/mcp/server.js
```

## Troubleshooting

### Server won't start
- Check API key is set in `env` config
- Restart your MCP client completely

### Tools not showing
- Verify config file location is correct
- Check absolute paths don't have typos
- Look at MCP client logs: `~/Library/Logs/Claude/mcp*.log`

### Local development issues
- Always use absolute paths
- Run `bun run build` after changes
- Rebuild with `bun run build:mcp`

## Config File Locations

- **Claude Desktop (macOS)**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Claude Desktop (Windows)**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Cline (VS Code)**: Settings → Extensions → Cline → MCP Settings

## Links

- 📖 [Full Documentation](./MCP.md)
- 🔧 [Implementation Details](./MCP-IMPLEMENTATION.md)
- 🏏 [Play Cricket API](https://www.play-cricket.com/api)
- 🔌 [Model Context Protocol](https://modelcontextprotocol.io)
