import { PrismaClient } from "@prisma/client";
import { Coffee } from "./myTypes";
const prisma = new PrismaClient();

const insertCoffee = async (coffee: Coffee) => {
    const coffeeData = { data: coffee },
      coffeeUrl = coffeeData.data.url,
      retrievedCoffee = await getCoffee(coffeeUrl);
    if (coffeeUrl && retrievedCoffee)
      await prisma.coffee_roasters.create(coffeeData);
    disconnect();
  },
  disconnect = async () => {
    await prisma.$disconnect();
  },
  getCoffee = async (coffeeUrl: string) => {
    return await prisma.coffee_roasters.findFirst({
      where: { url: coffeeUrl },
    });
  };

export { insertCoffee, disconnect, getCoffee };
