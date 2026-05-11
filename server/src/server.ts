import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import "dotenv/config";
import "reflect-metadata";
import { validateEnv, env } from "@/config/env";
import { AppDataSource } from "./db/data-source";
import { authRoutes } from "./modules/auth/auth.routes";
import { eventRoutes } from "./modules/events/event.routes";
import { meRoutes } from "./modules/me/me.routes";

const app = fastify({ logger: true });

app.decorate("authenticate", async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ message: "Unauthorized" });
  }
});

async function start() {
  try {
    validateEnv();

    await app.register(cors, {
      origin: env.corsOrigin
        ? env.corsOrigin.split(",").map((s) => s.trim())
        : env.nodeEnv !== "production",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    await app.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute",
    });

    await app.register(fastifyJwt, {
      secret: env.jwtSecret,
    });

    await app.register(authRoutes, { prefix: "/auth" });
    await app.register(eventRoutes, { prefix: "/events" });
    await app.register(meRoutes, { prefix: "/me" });

    await AppDataSource.initialize();
    app.log.info("Database connected");

    await app.listen({ port: env.port, host: env.host });
    app.log.info(`Server running on PORT ${env.port}`);
  } catch (err) {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    app.log.error(err);
    process.exit(1);
  }
}

start();
