import fastifyPlugin from "fastify-plugin";
import { Unauthorized } from "./_errors/Unauthorized.js";
export const AuthHandler = fastifyPlugin(async (app) => {
    app.addHook("preHandler", async (request) => {
        try {
            request.getCurrentUserToken = async () => {
                const { sub } = await request.jwtVerify();
                return sub;
            };
        }
        catch {
            throw new Unauthorized("Token not found!");
        }
    });
});
