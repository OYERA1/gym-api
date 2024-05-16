import { z } from "zod";
import { Elysia } from "elysia";
import { makeRegisterService } from "@/services/_factories/make-register-use-case";
import { UserAlreadyExistsError } from "@/services/_errors/user-already-exists-error";

const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
});

export const registerUser = new Elysia().post(
	"/users",
	async ({ body, set }) => {
		const { email, name, password } = registerBodySchema.parse(body);

		try {
			const registerService = makeRegisterService();

			await registerService.execute({ email, name, password });
			set.status = "Created";
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) {
				set.status = "Conflict";
				return { message: error.message };
			}

			throw error;
		}
	},
);
