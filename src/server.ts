import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { LoginUserRoute } from "./routes/auth/loginRoute.js";
import { RegisterUserRoute } from "./routes/auth/registerRoute.js";
import { CreateTaskRoute } from "./routes/tasks/createTaskRoute.js";
import { DeleteTaskRoute } from "./routes/tasks/deleteTaskRoute.js";
import { GetTaskByIdRoute } from "./routes/tasks/getTaskById.js";
import { GetTasksRoute } from "./routes/tasks/getTasksRoute.js";
import { UpdateTaskRoute } from "./routes/tasks/updateTaskRoute.js";
import fastifySwaggerUi from '@fastify/swagger-ui';

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

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

// app.register(ScalarApiReference, {
//   routePrefix: "/docs",
//   configuration: {
//     theme: "purple",
//     // desabilite opções que forçam carregar standalone.js
//     layout: "classic"
//   },
// });

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

app.register(LoginUserRoute);
app.register(RegisterUserRoute);

app.register(GetTasksRoute);
app.register(GetTaskByIdRoute);
app.register(CreateTaskRoute);
app.register(UpdateTaskRoute);
app.register(DeleteTaskRoute);

app
	.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" })
	.then(() => {
		console.log("🎨 API running at http://localhost:3000");
		console.log("🎁 Docs running at http://localhost:3000/docs");
	});
