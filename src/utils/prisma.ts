import { env } from "@/env";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
	// log: env.ENV === "dev" ? ["query"] : [],
});
