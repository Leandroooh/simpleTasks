import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";
export async function DeleteTaskRoute(app) {
    app
        .withTypeProvider()
        .register(AuthHandler)
        .delete("/task/delete/:id", {
        schema: {
            tags: ["Task"],
            params: z.object({
                id: z.string(),
            }),
        },
    }, async (request, reply) => {
        const { id } = request.params;
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
        const deletedTask = await prisma.task.delete({
            where: {
                id,
                userId,
            },
        });
        return reply.status(200).send(deletedTask);
    });
}
