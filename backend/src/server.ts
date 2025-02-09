/**
 * Initializes mongoose and express.
 */

import mongoose from "mongoose";

import app from "./app";
import { mongoURI, port } from "./config";

// Connect to MongoDB
void mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to Database.");
    app.listen(port, () => {
      console.log(`[server]: Server is running at ${port}`);
    });
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
  });
