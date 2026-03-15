import { db } from "../../config/database";
import { agreements } from "../../models/agreement";
import { matches } from "../../models/match";
import { startups } from "../../models/startup";
import { executives } from "../../models/executive";
import { eq } from "drizzle-orm";
import { newId } from "../../lib/id";
import { AGREEMENT_TEMPLATES } from "./templates";

type AgreementType =
  | "equity_grant"
  | "consulting_agreement"
  | "nda"
  | "ip_assignment"
  | "board_observer";

export class AgreementService {
  async generateAgreement(matchId: string, type: AgreementType) {
    // Fetch match with related startup and executive
    const matchResults = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId));
    if (matchResults.length === 0) throw new Error("Match not found");
    const match = matchResults[0];

    const startupResults = await db
      .select()
      .from(startups)
      .where(eq(startups.id, match.startupId));
    const executiveResults = await db
      .select()
      .from(executives)
      .where(eq(executives.id, match.executiveId));

    if (startupResults.length === 0) throw new Error("Startup not found");
    if (executiveResults.length === 0) throw new Error("Executive not found");

    const startup = startupResults[0];
    const executive = executiveResults[0];

    // Get template and fill variables
    const template = AGREEMENT_TEMPLATES[type];
    if (!template) throw new Error(`Unknown agreement type: ${type}`);

    const content = template
      .replace(/\{\{COMPANY_NAME\}\}/g, startup.name)
      .replace(/\{\{COMPANY_DESCRIPTION\}\}/g, startup.description)
      .replace(/\{\{FOUNDER_NAME\}\}/g, startup.founderName)
      .replace(/\{\{EXECUTIVE_NAME\}\}/g, executive.name)
      .replace(/\{\{EXECUTIVE_TITLE\}\}/g, executive.title)
      .replace(/\{\{ROLE\}\}/g, match.role)
      .replace(/\{\{DATE\}\}/g, new Date().toISOString().split("T")[0])
      .replace(/\{\{HOURS_PER_MONTH\}\}/g, String(executive.hoursPerMonth));

    const id = newId();
    await db.insert(agreements).values({
      id,
      matchId,
      type,
      content,
      templateVersion: "1.0.0",
      status: "draft",
    });

    return { id, type, status: "draft", content };
  }
}
