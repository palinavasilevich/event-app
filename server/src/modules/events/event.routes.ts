import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "@/db/data-source";
import { Event as EventEntity } from "@/db/entities/event.entity";
import { EventParticipant } from "@/db/entities/event-participant.entity";
import { createEventSchema, updateEventSchema } from "./event.schema";

type EventParams = { id: string };

export const eventRoutes: FastifyPluginAsync = async (app) => {
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

    const { title, description, capacity, address, startedAt, color } =
      parsedBody.data;

    const event = eventRepository.create({
      title,
      description,
      capacity,
      address,
      startedAt,
      color: color ?? null,
      ownerId: request.user.sub,
    });

    const savedEvent = await eventRepository.save(event);

    return reply.code(201).send({ ...savedEvent, participantCount: 0 });
  });

  app.get<{ Querystring: { search?: string } }>(
    "/",
    { preHandler: [app.authenticate] },
    async (request) => {
      const search = request.query.search;

      const query = eventRepository
        .createQueryBuilder("event")
        .loadRelationCountAndMap("event.participantCount", "event.participants")
        .where("event.startedAt > :now", { now: new Date() })
        .orderBy("event.startedAt", "ASC");

      if (search) {
        query.andWhere("LOWER(event.title) LIKE LOWER(:search)", {
          search: `%${search}%`,
        });
      }

      return query.getMany();
    },
  );

  app.get<{ Params: EventParams }>(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const event = await eventRepository
        .createQueryBuilder("event")
        .where("event.id = :id", { id: request.params.id })
        .loadRelationCountAndMap("event.participantCount", "event.participants")
        .getOne();

      if (!event) {
        return reply.code(404).send({ message: "Event not found" });
      }

      return reply.send(event);
    },
  );

  app.patch<{ Params: EventParams }>(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const event = await eventRepository.findOne({
        where: { id: request.params.id },
      });

      if (!event) {
        return reply.code(404).send({ message: "Event not found" });
      }

      if (event.ownerId !== request.user.sub) {
        return reply.code(403).send({
          message: "Only the owner of an event can edit it",
        });
      }

      const parsedBody = updateEventSchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({
          message: "Validation error",
          errors: parsedBody.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      Object.assign(event, parsedBody.data);

      const updatedEvent = await eventRepository.save(event);
      const participantCount = await participantsRepository.count({
        where: { eventId: updatedEvent.id },
      });
      return reply.send({ ...updatedEvent, participantCount });
    },
  );

  app.delete<{ Params: EventParams }>(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const event = await eventRepository.findOne({
        where: { id: request.params.id },
      });

      if (!event) {
        return reply.code(404).send({ message: "Event not found" });
      }

      if (event.ownerId !== request.user.sub) {
        return reply.code(403).send({
          message: "Only the owner of an event can delete it",
        });
      }

      await eventRepository.delete({ id: event.id });

      return reply.code(204).send();
    },
  );

  app.post<{ Params: EventParams }>(
    "/:id/join",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const event = await eventRepository.findOne({
        where: { id: request.params.id },
      });

      if (!event) {
        return reply.code(404).send({ message: "Event not found" });
      }

      if (event.ownerId === request.user.sub) {
        return reply.code(400).send({
          message: "You cannot join your event",
        });
      }

      const existingParticipation = await participantsRepository.findOne({
        where: { eventId: event.id, userId: request.user.sub },
      });

      if (existingParticipation) {
        return reply.code(409).send({
          message: "You have already joined this event",
        });
      }

      const participationCount = await participantsRepository.count({
        where: { eventId: event.id },
      });

      if (participationCount >= event.capacity) {
        return reply.code(409).send({
          message: "There are currently no available seats for this event",
        });
      }

      const participation = participantsRepository.create({
        eventId: event.id,
        userId: request.user.sub,
      });

      const savedParticipation =
        await participantsRepository.save(participation);

      return reply.code(201).send({
        participation: savedParticipation,
        message: "You have successfully joined the event",
      });
    },
  );

  app.delete<{ Params: EventParams }>(
    "/:id/join",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const event = await eventRepository.findOne({
        where: { id: request.params.id },
      });

      if (!event) {
        return reply.code(404).send({ message: "Event not found" });
      }

      const existingParticipation = await participantsRepository.findOne({
        where: { eventId: event.id, userId: request.user.sub },
      });

      if (!existingParticipation) {
        return reply.code(409).send({
          message: "You have not joined this event yet",
        });
      }

      await participantsRepository.delete({
        id: existingParticipation.id,
      });

      return reply.code(204).send();
    },
  );
};
