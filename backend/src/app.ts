import dotenv from "dotenv";
import mongoose from "mongoose";
import express, { Express, NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";

import userRoutes from "./routes/user";
import discussionRoutes from "./routes/discussion";
import { mongoURI } from "./config";

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
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/discussions", discussionRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Error handling middleware
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
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
