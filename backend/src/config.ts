import dotenv from "dotenv";

//load the env variables from .env file
dotenv.config({ path: ".env" });

function throwIfUndefined(envVar: string | undefined, error: Error) {
  if (!envVar) throw error;
  return envVar;
}

const port = throwIfUndefined(process.env.APP_PORT, new Error("No Port Found"));
const mongoURI = throwIfUndefined(process.env.MONGO_URI, new Error("No Mongo URI Found"));
const serviceAccountKey = throwIfUndefined(
  process.env.SERVICE_ACCOUNT_KEY,
  new Error("No Service Account Key"),
);
// console.log(`SERVICE_ACCOUNT_KEY: ${serviceAccountKey}`);

const firebaseConfig = throwIfUndefined(
  process.env.APP_FIREBASE_CONFIG,
  new Error("No Firebase Config"),
);

export { port, mongoURI, serviceAccountKey, firebaseConfig };
