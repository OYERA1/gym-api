import { Role, type Prisma, type User } from "@prisma/client";
import type { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: crypto.randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date(),
			role: Role.USER,
		};

		this.items.push(user);

		return user;
	}

	async findByEmail(email: string) {
		const user = this.items.find((item) => item.email === email);
		if (!user) return null;

		return user;
	}

	async findById(id: string): Promise<User | null> {
		const user = this.items.find((item) => item.id === id);

		if (!user) return null;

		return user;
	}

	async findAll() {
		return this.items;
	}
}
