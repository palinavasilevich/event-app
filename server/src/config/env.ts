import { config } from "dotenv";

config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  host: process.env.HOST ?? "0.0.0.0",
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
};

export const validateEnv = () => {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }
};
