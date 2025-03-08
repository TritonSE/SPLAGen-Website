import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";
import mongoose from "mongoose";

import announcementRoutes from "../src/routes/announcement";
import discussionRoutes from "../src/routes/discussion";
import replyRoutes from "../src/routes/reply";
import userRoutes from "../src/routes/user";

import { mongoURI } from "./config";

// Load environment variables
dotenv.config();

// Load environment variables
dotenv.config();

// Connect to MongoDB
void mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
  });


const app: Express = express();
const port = process.env.PORT ?? 3001;

app.use(express.json());

app.use("/api/announcement", announcementRoutes);
app.use("/api/users", userRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/replies", replyRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // 500 is the "internal server error" error code, this will be our fallback
  let statusCode = 500;
  let errorMessage = "An error has occurred.";

  // Check if the error is an instance of HttpError
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  // Handle general errors
  else if (error instanceof Error) {
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

// Start the server
//eslint-disable-next-line @typescript-eslint/restrict-template-expressions
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
