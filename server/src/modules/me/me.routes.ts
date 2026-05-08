import { AppDataSource } from "@/db/data-source";
import { EventParticipant } from "@/db/entities/event-participant.entity";
import { Event } from "@/db/entities/event.entity";
import { User } from "@/db/entities/user.entity";
import { FastifyPluginAsync } from "fastify";

export const meRoutes: FastifyPluginAsync = async (app) => {
  const participantsRepository = AppDataSource.getRepository(EventParticipant);
  const userRepository = AppDataSource.getRepository(User);
  const eventRepository = AppDataSource.getRepository(Event);

  app.get(
    "/events/joined",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const participation = await participantsRepository.find({
        where: { userId: request.user.sub },
        relations: ["event"],
        order: {
          joinedAt: "DESC",
        },
      });

      return participation.map((part) => ({
        joinedAt: part.joinedAt,
        event: part.event,
      }));
    },
  );

  app.get(
    "/events/favorites",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const user = await userRepository.findOne({
        where: { id: request.user.sub },
        relations: ["favoriteEvents"],
      });

      return user?.favoriteEvents ?? [];
    },
  );

  app.post(
    "/events/favorites/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const [user, event] = await Promise.all([
        userRepository.findOne({
          where: { id: request.user.sub },
          relations: ["favoriteEvents"],
        }),
        eventRepository.findOneBy({ id }),
      ]);

      if (!user || !event) {
        return reply.status(404).send({ message: "Not found" });
      }

      const alreadyFavorite = user.favoriteEvents.some((e) => e.id === id);
      if (!alreadyFavorite) {
        user.favoriteEvents = [...user.favoriteEvents, event];
        await userRepository.save(user);
      }

      return reply.status(201).send({ message: "Added to favorites" });
    },
  );

  app.delete(
    "/events/favorites/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const user = await userRepository.findOne({
        where: { id: request.user.sub },
        relations: ["favoriteEvents"],
      });

      if (!user) {
        return reply.status(404).send({ message: "Not found" });
      }

      user.favoriteEvents = user.favoriteEvents.filter((e) => e.id !== id);
      await userRepository.save(user);

      return reply.status(204).send();
    },
  );
};
