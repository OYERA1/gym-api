import type { CheckInsRepository } from "@/repositories/checkin-repository";
import type { GymRepository } from "@/repositories/gym-repositorys";
import type { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "../_errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckInServiceRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

interface CheckInServiceResponse {
	checkIn: CheckIn;
}

export class CheckInService {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymRepository,
	) {}

	async execute({
		gymId,
		userId,
		userLatitude,
		userLongitude,
	}: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) throw new ResourceNotFoundError();

		const distance = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		);

		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new Error();

		const checkinOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkinOnSameDate) throw new Error();

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		});

		return { checkIn };
	}
}
