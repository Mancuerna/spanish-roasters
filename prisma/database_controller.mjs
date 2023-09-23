import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const insertCoffee = async (coffee) => {
  coffee = {data: coffee};
  await prisma.coffee_roasters.create(coffee);
  await prisma.$disconnect();
};
