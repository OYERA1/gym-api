import type { CheckIn, Prisma } from "@prisma/client";
import type { CheckInsRepository } from "../checkin-repository";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn: CheckIn = {
			id: crypto.randomUUID(),
			gym_id: data.gym_id,
			user_id: data.user_id,
			created_at: new Date(),
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkInOnSameDate = this.items.find((checkin) => {
			const checkInDate = dayjs(checkin.created_at);
			const isOnSameDate =
				checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfTheDay);

			return checkin.user_id === userId && isOnSameDate;
		});

		if (!checkInOnSameDate) return null;

		return checkInOnSameDate;
	}
}
