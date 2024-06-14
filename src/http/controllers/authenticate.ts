import Elysia, { t as T } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "@/env";
import { z } from "zod";
import { InvalidCredentialsError } from "@/services/_errors/invalid-credentials-error";
import { makeAuthenticateService } from "@/services/_factories/make-authenticate-use-case";

const authenticateSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const authenticate = new Elysia()
	.use(
		jwt({
			name: "jwt",
			secret: env.JWT_SECRET,
			schema: T.Object({
				userId: T.String(),
			}),
		}),
	)
	.post("/sessions", async ({ jwt, body, set, cookie: { auth } }) => {
		const { email, password } = authenticateSchema.parse(body);
		const authenticateService = makeAuthenticateService();

		try {
			const { user } = await authenticateService.execute({ email, password });
			// auth.set({
			// 	value: await jwt.sign({
			// 		userId: user.id,
			// 	}),
			// 	httpOnly: true,
			// 	maxAge: 60 * 60 * 24 * 7,
			// });

			// set.status = "OK";
		} catch (error) {
			if (error instanceof InvalidCredentialsError) {
				set.status = "Bad Request";
				return { message: error.message };
			}
			throw error;
		}

		set.status = "OK";
	});
