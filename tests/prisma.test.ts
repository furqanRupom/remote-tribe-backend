import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

test("Should connect to Prisma successfully", async () => {
    const result = await prisma.user.findMany(); 
    expect(Array.isArray(result)).toBe(true);
});
