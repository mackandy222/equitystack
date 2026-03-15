import { Database } from "bun:sqlite";
import { randomUUIDv7 } from "bun";

const db = new Database("equitystack.db");

console.log("Seeding database...");

// Sample startups
const startups = [
  {
    id: randomUUIDv7(),
    name: "Elire",
    description:
      "Executive placement platform matching experienced professionals with early-stage startups on equity-for-services terms. Currently manual, looking to automate and scale.",
    stage: "early_revenue",
    accelerator: null,
    sector: "HR Tech / Marketplace",
    website: null,
    founder_name: "Test Founder",
    founder_email: "founder@elire.co",
    team_size: 3,
    monthly_revenue: 0,
    funding_raised: 0,
    pitch_summary:
      "We already run equity-for-services placements manually. EquityStack is the platform to automate and scale this model.",
    roles_needed: JSON.stringify(["CTO", "Head of Product", "CFO"]),
    equity_budget: 1500,
  },
  {
    id: randomUUIDv7(),
    name: "GreenRoute",
    description:
      "AI-powered logistics optimisation for last-mile delivery, reducing carbon emissions by 30%. Post Seedcamp, preparing for seed round.",
    stage: "post_accelerator",
    accelerator: "Seedcamp",
    sector: "Climate Tech / Logistics",
    website: "https://greenroute.example.com",
    founder_name: "Sarah Chen",
    founder_email: "sarah@greenroute.example.com",
    team_size: 4,
    monthly_revenue: 2000,
    funding_raised: 100000,
    pitch_summary:
      "Last-mile delivery is 40% of logistics emissions. Our AI cuts that by a third. 12 pilot customers, 94% retention.",
    roles_needed: JSON.stringify([
      "VP Sales",
      "Fractional CFO",
      "Head of Engineering",
    ]),
    equity_budget: 1000,
  },
  {
    id: randomUUIDv7(),
    name: "MedBridge AI",
    description:
      "Clinical trial matching platform using NLP to connect patients with relevant trials. Post EF, strong early traction with 3 pharma partners.",
    stage: "pre_revenue",
    accelerator: "Entrepreneur First",
    sector: "HealthTech / AI",
    website: null,
    founder_name: "Dr. Amir Patel",
    founder_email: "amir@medbridge.example.com",
    team_size: 2,
    monthly_revenue: 0,
    funding_raised: 75000,
    pitch_summary:
      "80% of clinical trials fail to recruit on time. We match patients to trials with 95% relevance accuracy.",
    roles_needed: JSON.stringify([
      "CTO",
      "Head of Regulatory",
      "Commercial Director",
    ]),
    equity_budget: 2000,
  },
];

// Sample executives
const executives = [
  {
    id: randomUUIDv7(),
    name: "James Morrison",
    email: "james@example.com",
    linkedin: "https://linkedin.com/in/jamesmorrison",
    title: "Fractional CFO",
    bio: "15 years in startup finance. Former CFO at two Series B companies. Specialises in fundraising preparation, financial modelling, and investor relations.",
    skills: JSON.stringify([
      "Financial modelling",
      "Fundraising",
      "Investor relations",
      "Cap table management",
      "Board reporting",
    ]),
    sectors: JSON.stringify(["SaaS", "FinTech", "Marketplace", "HR Tech"]),
    years_experience: 15,
    current_role: "Independent consultant",
    hours_per_month: 20,
    min_equity_bps: 50,
    max_equity_bps: 200,
    preferred_stages: JSON.stringify([
      "pre_revenue",
      "early_revenue",
      "post_accelerator",
    ]),
  },
  {
    id: randomUUIDv7(),
    name: "Dr. Lisa Zhang",
    email: "lisa@example.com",
    linkedin: "https://linkedin.com/in/lisazhang",
    title: "Fractional CTO",
    bio: "20 years building tech teams. Led engineering at a healthtech unicorn. Deep expertise in AI/ML, cloud architecture, and scaling engineering teams.",
    skills: JSON.stringify([
      "AI/ML",
      "Cloud architecture",
      "Team building",
      "Technical strategy",
      "Data engineering",
    ]),
    sectors: JSON.stringify(["HealthTech", "AI", "Climate Tech"]),
    years_experience: 20,
    current_role: "CTO at a mid-stage startup (part-time)",
    hours_per_month: 15,
    min_equity_bps: 75,
    max_equity_bps: 300,
    preferred_stages: JSON.stringify(["pre_revenue", "post_accelerator"]),
  },
  {
    id: randomUUIDv7(),
    name: "Mark Thompson",
    email: "mark@example.com",
    linkedin: "https://linkedin.com/in/markthompson",
    title: "VP Sales / Commercial Director",
    bio: "Built sales teams from 0 to 50 at three B2B SaaS companies. Expertise in enterprise sales, partnerships, and go-to-market strategy.",
    skills: JSON.stringify([
      "Enterprise sales",
      "Go-to-market",
      "Partnerships",
      "Sales operations",
      "Revenue strategy",
    ]),
    sectors: JSON.stringify(["SaaS", "Logistics", "Enterprise", "Marketplace"]),
    years_experience: 18,
    current_role: "Board advisor to several startups",
    hours_per_month: 25,
    min_equity_bps: 50,
    max_equity_bps: 150,
    preferred_stages: JSON.stringify([
      "early_revenue",
      "post_accelerator",
      "pre_seed",
    ]),
  },
  {
    id: randomUUIDv7(),
    name: "Rachel Adams",
    email: "rachel@example.com",
    linkedin: "https://linkedin.com/in/racheladams",
    title: "Head of Product",
    bio: "12 years in product management. Former Head of Product at a Techstars company that went on to Series A. Expert in marketplace dynamics and user research.",
    skills: JSON.stringify([
      "Product strategy",
      "User research",
      "Marketplace design",
      "Roadmap planning",
      "A/B testing",
    ]),
    sectors: JSON.stringify(["Marketplace", "HR Tech", "Consumer", "FinTech"]),
    years_experience: 12,
    current_role: "Product consultant",
    hours_per_month: 20,
    min_equity_bps: 40,
    max_equity_bps: 150,
    preferred_stages: JSON.stringify([
      "pre_revenue",
      "early_revenue",
      "post_accelerator",
    ]),
  },
];

// Insert startups
const insertStartup = db.prepare(`
  INSERT INTO startups (id, name, description, stage, accelerator, sector, website,
    founder_name, founder_email, team_size, monthly_revenue, funding_raised,
    pitch_summary, roles_needed, equity_budget)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const s of startups) {
  insertStartup.run(
    s.id, s.name, s.description, s.stage, s.accelerator, s.sector, s.website,
    s.founder_name, s.founder_email, s.team_size, s.monthly_revenue,
    s.funding_raised, s.pitch_summary, s.roles_needed, s.equity_budget
  );
}

// Insert executives
const insertExecutive = db.prepare(`
  INSERT INTO executives (id, name, email, linkedin, title, bio, skills, sectors,
    years_experience, current_role, hours_per_month, min_equity_bps, max_equity_bps,
    preferred_stages)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const e of executives) {
  insertExecutive.run(
    e.id, e.name, e.email, e.linkedin, e.title, e.bio, e.skills, e.sectors,
    e.years_experience, e.current_role, e.hours_per_month, e.min_equity_bps,
    e.max_equity_bps, e.preferred_stages
  );
}

console.log(`Seeded ${startups.length} startups and ${executives.length} executives.`);
console.log("Done.");
