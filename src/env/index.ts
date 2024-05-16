import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	ENV: z.enum(["dev", "test", "production"]).default("dev"),
	JWT_SECRET: z.string().default("secret"),
});

const _env = envSchema.safeParse(Bun.env);

if (!_env.success) {
	console.error("invalid environment variables", _env.error.format());
	throw new Error("invalid environment variables");
}

export const env = _env.data;
