import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileService } from "@/services/get-user-profile/get-users";
import Elysia from "elysia";

export const getUser = new Elysia().get(
	"/users/:userId",
	async ({ params: { userId } }) => {
		const prismaUsersRepository = new PrismaUsersRepository();
		const getService = new GetUserProfileService(prismaUsersRepository);
		return await getService.execute({ userId });
	},
);
