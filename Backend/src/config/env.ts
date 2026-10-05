import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

const nodeEnv = process.env.NODE_ENV ?? "development";

export const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  /** Comma-separated list of allowed browser origins, e.g. https://emlrkicukiro.rw,https://www.emlrkicukiro.rw */
  corsOrigins: (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-flash-latest",
  youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? "admin@church.local",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "ChangeThisPassword!"
};

if (env.isProduction && env.jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}
