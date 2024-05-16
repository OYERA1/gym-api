import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileService } from "./get-users";
import { beforeEach, describe, it, expect } from "bun:test";
import { ResourceNotFoundError } from "../_errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get Users", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileService(usersRepository);
	});

	it("should be able to get a user profile", async () => {
		const { id: userId } = await usersRepository.create({
			email: "johndoe@example.com",
			name: "John Doe",
			password_hash: "123456",
		});

		const { user } = await sut.execute({ userId });

		expect(user.name).toEqual("John Doe");
	});

	it("should not be able to get a user profile with wrong id", async () => {
		expect(sut.execute({ userId: "wrong-id" })).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		);
	});
});
