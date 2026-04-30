import { DataSource } from "typeorm";
import { env } from "@/config/env";
import { User } from "./entities/user.entity";
import { EventParticipant } from "./entities/event-participant.entity";
import { Event } from "./entities/event.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.databaseUrl,
  synchronize: false,
  logging: true,
  entities: [User, Event, EventParticipant],
  migrations: ["src/db/migrations/**/*.ts"],
  subscribers: [],
});
