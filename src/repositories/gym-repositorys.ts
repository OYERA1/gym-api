import type { Gym, Prisma } from "@prisma/client";

export interface GymRepository {
	// create(data: Prisma.GymCreateInput): Promise<Gym>;
	findById(userId: string): Promise<Gym | null>;
}
