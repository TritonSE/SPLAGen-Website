import env from "./util/validateEnv";

export type FirebaseConfig = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
};

// Parse the Firebase configuration JSON string
let firebaseConfig: FirebaseConfig;
try {
  firebaseConfig = JSON.parse(env.BACKEND_FIREBASE_SETTINGS as string) as FirebaseConfig;
} catch (error) {
  console.log(error);
  throw new Error("Error parsing BACKEND_FIREBASE_SETTINGS in the .env file:");
}

// Old working configuration is important for deployment purposes and left for reference:
// Firebase configuration from environment variables
// const firebaseConfig = {
//   projectId: throwIfUndefined(
//     process.env.PROJECT_ID,
//     new Error("PROJECT_ID is missing in the .env"),
//   ),
//   clientEmail: throwIfUndefined(
//     process.env.CLIENT_EMAIL,
//     new Error("CLIENT_EMAIL is missing in the .env"),
//   ),
//   privateKey: throwIfUndefined(
//     process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     new Error("PRIVATE_KEY is missing or incorrectly formatted in the .env"),
//   ),
// };

const mongoURI = env.MONGODB_URI;
const port = env.PORT;

export { firebaseConfig, mongoURI, port };
