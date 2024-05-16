import type { Gym } from "@prisma/client";
import type { GymRepository } from "../gym-repositorys";

export class InMemoryGymsRepository implements GymRepository {
	public items: Gym[] = [];

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((item) => item.id === id);

		if (!gym) return null;

		return gym;
	}
}
