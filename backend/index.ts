import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import userRoutes from './routes/user'

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/api/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
