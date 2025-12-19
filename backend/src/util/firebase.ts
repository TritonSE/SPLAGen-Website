import admin, { AppOptions } from "firebase-admin";

import env from "./validateEnv";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(env.SERVICE_ACCOUNT_KEY as AppOptions),
  });
}

const firebaseAdminAuth = admin.auth();

export { firebaseAdminAuth };
