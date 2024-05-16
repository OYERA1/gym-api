import Elysia from "elysia";
import { registerUser } from "./http/controllers/register";
import { env } from "./env";
import { ZodError } from "zod";
import { getUser } from "./http/controllers/get";
import { authenticate } from "./http/controllers/authenticate";

const app = new Elysia()
	.onError(({ code, error, set }) => {
		if (error instanceof ZodError) {
			set.status = 400;
			return { message: "Validation error", issue: error.format() };
		}

		if (code === "NOT_FOUND") {
			set.status = 404;
			return "Resource not found :(";
		}

		if (env.ENV !== "production") {
			console.error(error);
		} else {
			// TODO log error to a service like Sentry / DataDog
		}

		set.status = 500;
		return "Internal server error";
	})
	.use(registerUser)
	.use(getUser)
	.use(authenticate)
	.get("/", () => {
		return "Welcome to Elysia!";
	});

app.listen(
	{
		port: env.PORT,
		hostname: "localhost",
	},
	() => {
		console.log(
			`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
		);
	},
);
