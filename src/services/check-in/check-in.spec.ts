import { CheckInService } from "./check-in";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	mock,
	setSystemTime,
} from "bun:test";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInRepository;
let gymRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Checkin Service Test", () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInRepository();
		gymRepository = new InMemoryGymsRepository();
		sut = new CheckInService(checkInsRepository, gymRepository);

		gymRepository.items.push({
			id: "gym-id",
			latitude: new Decimal(0),
			longitude: new Decimal(0),
			createdAt: new Date(),
			description: "Gym Description",
			phone: "Gym Phone",
			title: "Gym Title",
		});
	});

	afterEach(() => {
		mock.restore();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check-in twice in the same day", async () => {
		setSystemTime(new Date(2022, 1, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(
			sut.execute({
				gymId: "gym-id",
				userId: "user-id",
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it("should be able to check-in twice but in different days", async () => {
		setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0,
		});

		setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym ", async () => {
		gymRepository.items.push({
			id: "gym-id-2",
			latitude: new Decimal(-23.5161655),
			longitude: new Decimal(-46.7811784),
			createdAt: new Date(),
			description: "Gym Description",
			phone: "Gym Phone",
			title: "Gym Title",
		});

		expect(
			sut.execute({
				gymId: "gym-id-2",
				userId: "user-id",
				userLatitude: -23.5295634,
				userLongitude: -46.8149435,
			}),
		).rejects.toBeInstanceOf(Error);
	});
});
