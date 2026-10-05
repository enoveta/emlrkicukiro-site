import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? "admin@church.local",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "ChangeThisPassword!"
};
