import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const insertCoffee = async (coffee) => {
    coffee = { data: coffee };
    await prisma.coffee_roasters.create(coffee);
    disconnect();
  },
  disconnect = async () => {
    await prisma.$disconnect();
  },
  getCoffee = async (coffeeUrl) => {
    return await prisma.coffee_roasters.findFirst({
      where: { url: coffeeUrl },
    });
  };

export { insertCoffee, disconnect, getCoffee };
