/**
 * Parses .env parameters and ensures they are of required types and are not missing.
 * If any .env parameters are missing, the server will not start and an error will be thrown.
 */

import dotenv from "dotenv";
import { cleanEnv } from "envalid";
import { bool, email, json, port, str } from "envalid/dist/validators";

dotenv.config();

export default cleanEnv(process.env, {
  PORT: port(), // Port to run backend on
  MONGO_URI: str(), // URI of MongoDB database to use
  FRONTEND_ORIGIN: str(), // URL of frontend, to allow CORS from frontend
  EMAIL_USER: email(), // Email address to use for sending emails
  EMAIL_APP_PASSWORD: str(), // App password to use for sending emails
  BACKEND_FIREBASE_SETTINGS: json(), // Firebase settings for backend, stored as a JSON string
  SERVICE_ACCOUNT_KEY: json(), // Private service account key for backend, stored as a JSON string
  SECURITY_BYPASS: bool(), // Security bypass around requireSignedIn middleware
});
