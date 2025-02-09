/**
 * Initializes mongoose and express.
 */

import mongoose from "mongoose";

import { mongoURI } from "./config";

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
