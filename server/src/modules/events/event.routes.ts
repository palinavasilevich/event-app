import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "@/db/data-source";
import { Event as EventEntity } from "@/db/entities/event.entity";
import { EventParticipant } from "@/db/entities/event-participant.entity";
import { createEventSchema } from "./event.schema";

export const EventRoutes: FastifyPluginAsync = async (app) => {
  const eventRepository = AppDataSource.getRepository(EventEntity);
  const participantsRepository = AppDataSource.getRepository(EventParticipant);

  app.post("/", { preHandler: [app.authenticate] }, async (request, reply) => {
    const parsedBody = createEventSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: parsedBody.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { title, description, capacity, address, startedAt } =
      parsedBody.data;

    const event = eventRepository.create({
      title,
      description,
      capacity,
      address,
      startedAt,
      ownerId: request.user.sub,
    });

    const savedEvent = await eventRepository.save(event);

    return reply.code(201).send(savedEvent);
  });
};
