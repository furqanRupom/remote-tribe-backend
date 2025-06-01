import { AuthService } from "../src/app/modules/auth/auth.service";
import { setCache } from "../src/app/redis";
import client from "../src/app/redis/redis.config";
import prisma from "../src/prisma";


beforeAll(async () => {
    await client.connect();
    await prisma.$connect();
});

afterAll(async () => {
    await client.close();
    await prisma.$disconnect();
});


describe("AuthService", () => {
    const dummyUser = {
        name: "Test User",
        email: "furqanrupom978@gmail.com",
        password: "Fab@12345",
    };

    describe("userRegistration", () => {
        it("should send verification mail and cache data", async () => {
            await expect(AuthService.userRegistration(dummyUser)).resolves.toBeUndefined();
        });
        it("should throw error if user already exists", async () => {
            await expect(AuthService.userRegistration(dummyUser)).rejects.toThrow(
                "User already exists"
            );
        });
    });

    describe("confirmRegistration", () => {
        const code = "123456";
        it("should create a user from cached code", async () => {
            await AuthService.confirmRegistration(code);

            const user = await prisma.user.findUniqueOrThrow({
                where: { email: dummyUser.email },
            });
            const { password, ...rest } = user;

            expect(rest).not.toBeNull();
            expect(rest?.is_verified).toBe(true);
        });

        it("should throw error for invalid code", async () => {
            await expect(AuthService.confirmRegistration("invalid")).rejects.toThrow();
        });
    });

    describe("login", () => {
        it("should login and return tokens", async () => {
            const result = await AuthService.login({
                email: dummyUser.email,
                password: dummyUser.password,
            });

            expect(result).toHaveProperty("accessToken");
            expect(result).toHaveProperty("refreshToken");
        });

        it("should throw for wrong password", async () => {
            await expect(
                AuthService.login({ email: dummyUser.email, password: "wrongpass" })
            ).rejects.toThrow("Invalid password");
        });

        it("should throw for non-existent user", async () => {
            await expect(
                AuthService.login({ email: "fake@example.com", password: "123456" })
            ).rejects.toThrow("User not found");
        });
    });

    describe("profile", () => {
        let userId: string;

        beforeAll(async () => {
            const user = await prisma.user.findUnique({
                where: { email: dummyUser.email },
            });
            userId = user!.id;
        });

        it("should return user profile", async () => {
            const profile = await AuthService.profile(userId);
            expect(profile).toHaveProperty("email", dummyUser.email);
            expect(profile).not.toHaveProperty("password");
        });

        it("should throw error for invalid id", async () => {
            await expect(AuthService.profile("invalid-id")).rejects.toThrow("User not found");
        });
    });
});
