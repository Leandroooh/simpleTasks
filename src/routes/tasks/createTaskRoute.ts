import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function CreateTaskRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.post(
			"/task",
			{
				schema: {
					body: z.object({
						title: z.string().min(5),
						content: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { title, content } = request.body;
				const userId = await request.getCurrentUserToken();

				if (!userId) {
					return reply.status(401).send({ message: "Unauthorized" });
				}

				const task = await prisma.task.create({
					data: {
						title,
						content,
						userId,
					},
				});
				return reply.status(201).send(task);
			},
		);
}
