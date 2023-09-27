import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const insertCoffee = async (coffee) => {
    coffee = { data: coffee };
    if (coffee.data.url && getCoffee(coffee.url) !== null)
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
