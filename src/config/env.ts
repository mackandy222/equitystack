import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("sqlite://equitystack.db"),
  ANTHROPIC_API_KEY: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default("change-me-in-production"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
