export const hashPassword = (password: string, round = 6): string => {
	return Bun.password.hashSync(password, {
		algorithm: "bcrypt",
		cost: round,
	});
};
