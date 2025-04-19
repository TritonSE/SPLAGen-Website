import admin, { AppOptions } from "firebase-admin";

import env from "./validateEnv";

if (!admin.apps.length) {
  admin.initializeApp(env.BACKEND_FIREBASE_SETTINGS as AppOptions);
}

const firebaseAdminAuth = admin.auth();

export { firebaseAdminAuth };
