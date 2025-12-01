import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/prisma/client.js";
export async function RegisterUserRoute(app) {
    app.withTypeProvider().post("/auth/register", {
        schema: {
            tags: ["Auth"],
            body: z.object({
                email: z.email(),
                password: z.string().min(5),
            }),
        },
    }, async (request, reply) => {
        const { email, password } = request.body;
        const emailAlreadyExist = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (emailAlreadyExist) {
            return reply.status(400).send({
                message: "Invalid credentials, please verify and try again!",
            });
        }
        const hashPassword = await hash(password, 6);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
            },
        });
        return reply.status(201).send(user);
    });
}
