import { AppDataSource } from "@/db/data-source";
import { EventParticipant } from "@/db/entities/event-participant.entity";
import { FastifyPluginAsync } from "fastify";

export const meRoutes: FastifyPluginAsync = async (app) => {
  const participantsRepository = AppDataSource.getRepository(EventParticipant);

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
};
