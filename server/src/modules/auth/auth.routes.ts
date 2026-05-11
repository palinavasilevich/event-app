import { FastifyPluginAsync } from "fastify";
import argon2 from "argon2";
import { AppDataSource } from "@/db/data-source";
import { User } from "@/db/entities/user.entity";
import { loginSchema, registerSchema } from "./auth.schemas";

const AUTH_RATE_LIMIT = { max: 10, timeWindow: "1 minute" };

export const authRoutes: FastifyPluginAsync = async (app) => {
  const userRepository = AppDataSource.getRepository(User);

  app.post(
    "/register",
    { config: { rateLimit: AUTH_RATE_LIMIT } },
    async (request, reply) => {
      const parsedBody = registerSchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({
          message: "Validation error",
          errors: parsedBody.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      const { email, password, name } = parsedBody.data;

      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        return reply
          .code(409)
          .send({ message: "A user with this email already exists" });
      }

      const passwordHash = await argon2.hash(password);
      const user = userRepository.create({
        email,
        passwordHash,
        name,
      });

      const savedUser = await userRepository.save(user);
      const token = await reply.jwtSign(
        { sub: savedUser.id, email: savedUser.email },
        { expiresIn: "7d" },
      );

      return reply.code(201).send({
        token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
        },
      });
    },
  );

  app.post(
    "/login",
    { config: { rateLimit: AUTH_RATE_LIMIT } },
    async (request, reply) => {
      const parsedBody = loginSchema.safeParse(request.body);

      if (!parsedBody.success) {
        return reply.code(400).send({
          message: "Validation error",
          errors: parsedBody.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      const { email, password } = parsedBody.data;
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return reply.code(401).send({ message: "Incorrect login or password" });
      }

      const isPasswordValid = await argon2.verify(user.passwordHash, password);

      if (!isPasswordValid) {
        return reply.code(401).send({ message: "Incorrect login or password" });
      }

      const token = await reply.jwtSign(
        { sub: user.id, email: user.email },
        { expiresIn: "7d" },
      );

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    },
  );

  app.get(
    "/me",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const userId = request.user.sub;
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      return reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    },
  );
};
