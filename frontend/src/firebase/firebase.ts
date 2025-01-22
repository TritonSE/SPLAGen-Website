import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import env from "@/util/validateEnv";

/**
 * Initializes Firebase for the frontend, using the NEXT_PUBLIC_FIREBASE_SETTINGS
 * environment variable.
 */
export const initFirebase = () => {
  if (!env.NEXT_PUBLIC_FIREBASE_SETTINGS) {
    throw new Error("Cannot get firebase settings");
  }

  const firebaseConfig = env.NEXT_PUBLIC_FIREBASE_SETTINGS;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  return { app, auth };
};

export const loginUser = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error("Can't Login User");
  }
};