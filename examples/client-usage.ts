// Example: Using the Play Cricket Client directly
import { Client } from "../src/lib/client";

// Initialize client with your API key
const apiKey = process.env.PLAY_CRICKET_API_KEY || "your-api-key";
const client = new Client(apiKey);

async function examples() {
  try {
    // Example 1: Get teams in a competition
    console.log("Getting teams in competition...");
    const teams = await client.getTeamsInComp(12345);
    console.log("Teams:", JSON.stringify(teams, null, 2));

    // Example 2: Get competitions for a season
    console.log("\nGetting competitions...");
    const competitions = await client.getCompetitions(
      2024,
      7300000,
      "divisions"
    );
    console.log("Competitions:", JSON.stringify(competitions, null, 2));

    // Example 3: Get league table
    console.log("\nGetting league table...");
    const table = await client.getLeagueTable(87298);
    console.log("League Table:", JSON.stringify(table, null, 2));

    // Example 4: Get matches with filters
    console.log("\nGetting matches...");
    const matches = await client.getMatches(1234, 2024, {
      teamId: "123456",
      fromEntryDate: new Date("2024-05-01"),
    });
    console.log("Matches:", JSON.stringify(matches, null, 2));

    // Example 5: Get match details
    console.log("\nGetting match detail...");
    const matchDetail = await client.getMatchDetail(789012);
    console.log("Match Detail:", JSON.stringify(matchDetail, null, 2));

    // Example 6: Get results summary
    console.log("\nGetting results...");
    const results = await client.getResults(1234, 2024);
    console.log("Results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Run examples
examples();
