import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import "reflect-metadata";

const app = fastify({ logger: true });

const PORT = 3000;
const HOST = "0.0.0.0";

async function start() {
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server running on PORT ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
