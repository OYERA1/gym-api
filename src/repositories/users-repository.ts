import type { Prisma, User } from "@prisma/client";

export interface UsersRepository {
	create(data: Prisma.UserCreateInput): Promise<User>;
	findById(id: User["id"]): Promise<User | null>;
	findByEmail(email: User["email"]): Promise<User | null>;
	findAll(): Promise<User[]>;
}
