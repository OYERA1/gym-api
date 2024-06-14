import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterService } from "../register/register";
import { AuthenticateService } from "../authenticate/authenticate";

export const makeAuthenticateService = () => {
	const usersRepository = new PrismaUsersRepository();
	const authenticateService = new AuthenticateService(usersRepository);

	return authenticateService;
};
