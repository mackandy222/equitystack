import Anthropic from "@anthropic-ai/sdk";
import { db } from "../../config/database";
import { startups } from "../../models/startup";
import { executives } from "../../models/executive";
import { matches } from "../../models/match";
import { eq } from "drizzle-orm";
import { newId } from "../../lib/id";
import { env } from "../../config/env";

interface MatchResult {
  executiveId: string;
  score: number;
  rationale: string;
  skillMatch: number;
  sectorMatch: number;
  stageMatch: number;
}

export class MatchingEngine {
  private client: Anthropic | null = null;

  private getClient(): Anthropic {
    if (!this.client) {
      if (!env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is required for AI matching");
      }
      this.client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    }
    return this.client;
  }

  async generateMatches(
    startupId: string,
    role: string,
    limit: number
  ): Promise<MatchResult[]> {
    // Fetch startup details
    const startupResults = await db
      .select()
      .from(startups)
      .where(eq(startups.id, startupId));
    if (startupResults.length === 0) throw new Error("Startup not found");
    const startup = startupResults[0];

    // Fetch all active executives
    const activeExecutives = await db
      .select()
      .from(executives)
      .where(eq(executives.status, "active"));

    if (activeExecutives.length === 0) return [];

    // Use Claude for intelligent matching
    const client = this.getClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are an expert startup-executive matchmaker. Analyze the compatibility between this startup and the available executives.

STARTUP:
- Name: ${startup.name}
- Description: ${startup.description}
- Stage: ${startup.stage}
- Sector: ${startup.sector}
- Accelerator: ${startup.accelerator || "None"}
- Team size: ${startup.teamSize}
- Monthly revenue: £${startup.monthlyRevenue}
- Role needed: ${role}
- Pitch: ${startup.pitchSummary || "N/A"}
- Roles needed: ${startup.rolesNeeded || "N/A"}

AVAILABLE EXECUTIVES:
${activeExecutives
  .map(
    (e, i) => `
${i + 1}. ID: ${e.id}
   Name: ${e.name}
   Title: ${e.title}
   Skills: ${e.skills}
   Sectors: ${e.sectors}
   Experience: ${e.yearsExperience} years
   Hours/month: ${e.hoursPerMonth}
   Bio: ${e.bio}
   Preferred stages: ${e.preferredStages || "Any"}
`
  )
  .join("")}

Return a JSON array of the top ${limit} matches. Each match should have:
- executiveId: the executive's ID
- score: 0-100 compatibility score
- rationale: 2-3 sentence explanation of why this is a good match
- skillMatch: 0-100 skill compatibility score
- sectorMatch: 0-100 sector compatibility score
- stageMatch: 0-100 stage preference compatibility score

Consider: skill relevance to the role, sector experience, stage preference alignment, time availability, and how the executive's experience complements the startup's current gaps.

Return ONLY valid JSON, no other text.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const matchResults: MatchResult[] = JSON.parse(content.text);

    // Store matches in the database
    for (const match of matchResults) {
      await db.insert(matches).values({
        id: newId(),
        startupId,
        executiveId: match.executiveId,
        role,
        score: match.score,
        rationale: match.rationale,
        skillMatch: match.skillMatch,
        sectorMatch: match.sectorMatch,
        stageMatch: match.stageMatch,
      });
    }

    return matchResults;
  }
}
