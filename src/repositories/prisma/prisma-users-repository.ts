import type { Prisma } from "@prisma/client";
import type { UsersRepository } from "../users-repository";
import { prisma } from "@/utils/prisma";

export class PrismaUsersRepository implements UsersRepository {
	async create(data: Prisma.UserCreateInput) {
		return await prisma.user.create({
			data,
		});
	}

	async findByEmail(email: string) {
		return await prisma.user.findFirst({
			where: {
				email,
			},
		});
	}

	async findById(id: string) {
		return await prisma.user.findFirst({
			where: {
				id,
			},
		});
	}

	async findAll() {
		return await prisma.user.findMany();
	}
}
