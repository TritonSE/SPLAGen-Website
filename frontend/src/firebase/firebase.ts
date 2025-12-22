import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import env from "@/util/validateEnv";

/**
 * Initializes Firebase for the frontend, using the NEXT_PUBLIC_FIREBASE_SETTINGS
 * environment variable.
 */
export const initFirebase = () => {
  if (!env.NEXT_PUBLIC_FIREBASE_SETTINGS) {
    throw new Error("Cannot get firebase settings");
  }

  const firebaseConfig = env.NEXT_PUBLIC_FIREBASE_SETTINGS as FirebaseOptions;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const storage = getStorage(app);

  return { app, auth, storage };
};
