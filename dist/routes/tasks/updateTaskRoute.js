import z from "zod";
import { AuthHandler } from "../../middlewares/AuthHandler.js";
import { prisma } from "../../prisma/client.js";
export async function UpdateTaskRoute(app) {
    app
        .withTypeProvider()
        .register(AuthHandler)
        .patch("/task/update/:id", {
        schema: {
            tags: ["Task"],
            params: z.object({
                id: z.string(),
            }),
            body: z.object({
                title: z.string().min(5),
                content: z.string().optional(),
            }),
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const { title, content } = request.body;
        const userId = await request.getCurrentUserToken();
        const findTaskById = await prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!findTaskById) {
            return reply.status(404).send({ message: "Task not found!" });
        }
        const updatedTask = await prisma.task.update({
            where: {
                id,
            },
            data: {
                title,
                content,
            },
        });
        return reply.status(200).send(updatedTask);
    });
}
