import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Simple Tasks API",
			description: "Simple Tasks API with Register and Login",
			version: "1.0.0",
		},
	},
});

app.register(ScalarApiReference, {
	routePrefix: "/docs",
	configuration: {
		theme: "purple",
	},
});

const secret = process.env.JWT_SECRET;
if (!secret) {
	throw new Error("JWT_SECRET is not defined");
}

app.register(fastifyJwt, {
	secret,
});

app.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

app
	.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" })
	.then(() => {
		console.log("Server listening on port 3000");
	});
