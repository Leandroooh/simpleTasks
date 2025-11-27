import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "@/prisma/client.js";

export async function RegisterUserRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/register",
		{
			schema: {
				tags: ["Auth"],
				body: z.object({
					email: z.string(),
					password: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const user = await prisma.user.create({
				data: {
					email,
					password,
				},
			});

			return reply.status(201).send(user);
		},
	);
}
