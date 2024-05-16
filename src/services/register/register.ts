import type { UsersRepository } from "@/repositories/users-repository";
import type { User } from "@prisma/client";
import { hashPassword } from "@/utils/hashPassword";
import { UserAlreadyExistsError } from "../_errors/user-already-exists-error";

interface RegisterServiceRequest {
	email: string;
	name: string;
	password: string;
}

interface RegisterServiceResponse {
	user: User;
}

export class RegisterService {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		name,
		password,
	}: RegisterServiceRequest): Promise<RegisterServiceResponse> {
		const password_hash = await Bun.password.hash(password, "bcrypt");

		const userExists = await this.usersRepository.findByEmail(email);

		if (userExists) throw new UserAlreadyExistsError();

		const user = await this.usersRepository.create({
			email,
			name,
			password_hash,
		});

		return { user };
	}
}
