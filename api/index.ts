import express from "express";
import { getCoffee } from "../prisma/database_controller";
const app = express();
app.use(express.json());

app.get(`/coffee`, async (req, res) => {
  const coffeeUrl: string = req.query.coffeUrl as string;
  const coffeeData = await getCoffee(coffeeUrl);
  if (coffeeData !== null) res.status(200).json(coffeeData);
  else res.status(404).json({ error: "Coffee not found" });
});

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
