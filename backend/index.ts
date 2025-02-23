import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import directoryRoutes from "./src/routes/directory";
import discussionRoutes from "./src/routes/discussion";
import replyRoutes from "./src/routes/reply";
import userRoutes from "./src/routes/user";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/users", userRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/directory", directoryRoutes);

app.listen(port, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
