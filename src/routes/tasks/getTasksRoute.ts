import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/prisma/client.js";

export async function GetTasksRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/tasks",
		{
			schema: {
				tags: ["Task"],
				querystring: z.object({
					page: z.coerce.number().default(1),
					pageSize: z.coerce.number().default(6),
				}),
			},
		},
		async (request, reply) => {
			const { page, pageSize } = request.query;
			const userId = await request.getCurrentUserToken();

			const pageCountItems = await prisma.task.count({
				where: {
					userId,
				},
			});

			const totalPages = Math.ceil(pageCountItems / pageSize);

			const userTasks = await prisma.task.findMany({
				skip: (page - 1) * pageSize,
				take: pageSize,
				where: {
					userId,
				},
			});

			if (userTasks.length === 0) {
				return reply.status(404).send({ message: "Any task found!" });
			}

			return reply.status(200).send({ userTasks, pageCountItems, totalPages });
		},
	);
}
