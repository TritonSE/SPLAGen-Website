import admin from "firebase-admin";

// Import the firebaseConfig from config.ts
import { firebaseConfig } from "../config";

// Initialize Firebase if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseConfig.projectId,
      clientEmail: firebaseConfig.clientEmail,
      privateKey: firebaseConfig.privateKey,
    }),
  });
}

const firebaseAdminAuth = admin.auth();

export { firebaseAdminAuth };
