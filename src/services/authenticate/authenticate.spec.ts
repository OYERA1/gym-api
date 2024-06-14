import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { AuthenticateService } from "./authenticate";
import { InvalidCredentialsError } from "../_errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateService(usersRepository);
	});

	it("should authenticate user", async () => {
		const password = "123456";
		const email = "oyera@usp.br";

		usersRepository.create({
			email,
			name: "Oyera",
			password_hash: Bun.password.hashSync(password, "bcrypt"),
		});

		const { user } = await sut.execute({
			email,
			password,
		});

		expect(user.email).toBe(email);
	});

	it("should not authenticate with wrong email", async () => {
		expect(
			sut.execute({
				email: "johnDoe@example.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not authenticate with wrong password", async () => {
		usersRepository.create({
			email: "oyera@usp.br",
			name: "Oyera",
			password_hash: Bun.password.hashSync("123456", "bcrypt"),
		});

		expect(
			sut.execute({
				email: "oyera@usp.br",
				password: "1234567",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
