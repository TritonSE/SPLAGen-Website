import admin from "firebase-admin";

// Import the firebaseConfig from config.ts
import { firebaseConfig } from "../config";

// Initialize Firebase if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseConfig.project_id,
      clientEmail: firebaseConfig.client_email,
      privateKey: firebaseConfig.private_key,
    }),
  });
}

const firebaseAdminAuth = admin.auth();

export { firebaseAdminAuth };
