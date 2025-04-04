import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

function throwIfUndefined(envVar: string | undefined, error: Error) {
  if (!envVar) throw error;
  return envVar;
}

// Firebase configuration from environment variables
const firebaseConfig = {
  projectId: throwIfUndefined(
    process.env.PROJECT_ID,
    new Error("PROJECT_ID is missing in the .env"),
  ),
  clientEmail: throwIfUndefined(
    process.env.CLIENT_EMAIL,
    new Error("CLIENT_EMAIL is missing in the .env"),
  ),
  privateKey: throwIfUndefined(
    process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    new Error("PRIVATE_KEY is missing or incorrectly formatted in the .env"),
  ),
};

const mongoURI = throwIfUndefined(process.env.MONGO_URI, new Error("No Mongo URI Found"));
const port = throwIfUndefined(process.env.PORT, new Error("No Port Found"));

export { firebaseConfig, mongoURI, port };
