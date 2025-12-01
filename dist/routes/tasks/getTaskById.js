import z from "zod";
import { AuthHandler } from "../../middlewares/AuthHandler.js";
import { prisma } from "../../prisma/client.js";
export async function GetTaskByIdRoute(app) {
    app
        .withTypeProvider()
        .register(AuthHandler)
        .get("/task/:id", {
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
        const taskDetails = await prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });
        return reply.status(200).send(taskDetails);
    });
}
