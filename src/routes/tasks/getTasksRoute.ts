import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function GetTasksRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.get(
			"/tasks",
			{
				schema: {
					tags: ["Task"],
					querystring: z.object({
						page: z.coerce.number().int().min(1).default(1),
						pageSize: z.coerce.number().int().min(1).max(100).default(6),
					}),
				},
			},
			async (request, reply) => {
				const { page, pageSize } = request.query;
				const userId = await request.getCurrentUserToken();

				const totalItems = await prisma.task.count({
					where: {
						userId,
					},
				});

				// Nenhuma task — retornar lista vazia, não 404
				if (totalItems === 0) {
					return reply.status(200).send({
						userTasks: [],
						pageCountItems: 0,
						totalPages: 0,
					});
				}

				const totalPages = Math.ceil(totalItems / pageSize);

				// Página maior do que existe → página vazia, comportamento consistente
				if (page > totalPages) {
					return reply.status(200).send({
						userTasks: [],
						pageCountItems: totalItems,
						totalPages,
					});
				}

				const userTasks = await prisma.task.findMany({
					skip: (page - 1) * pageSize,
					take: pageSize,
					where: {
						userId,
					},
				});

				return reply.status(200).send({
					userTasks,
					pageCountItems: totalItems,
					totalPages,
				});
			},
		);
}
