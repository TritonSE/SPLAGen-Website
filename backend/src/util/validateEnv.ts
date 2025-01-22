/**
 * Parses .env parameters and ensures they are of required types. If any .env parameters are
 * missing, the server will not start and an error will be thrown.
 */

import { cleanEnv } from "envalid";
import { port, str, json } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  PORT: port(),
  MONGODB_URI: str(),
  FRONTEND_ORIGIN: str(), // URL of frontend, to allow CORS from frontend
  BACKEND_FIREBASE_SETTINGS: json(), // Firebase settings for backend, stored as a JSON string
  SERVICE_ACCOUNT_KEY: json(), // Private service account key for backend, stored as a JSON string
});
