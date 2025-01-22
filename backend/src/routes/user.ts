import express from "express";

import { requireAdmin, requireSignedIn, requireStaffOrAdmin } from "../middleware/auth";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import UserModel from "../models/user";
import * as UserController from "../controllers/user";
import * as UserValidator from "../validators/user";

const router = express.Router();

router.get("/whoami", requireSignedIn, UserController.getWhoAmI);
router.get("/", requireSignedIn, requireAdmin, UserController.getUsers);
router.post(
  "/",
  requireSignedIn,
  requireAdmin,
  UserValidator.createUser,
  UserController.createUser,
);
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth();
  
  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Store UID in MongoDB
    await UserModel.create({ email, firebaseUID: uid });

    res.status(201).send({ message: 'User created successfully', uid });
  } 
  catch (error) {
    res.status(500).send({ error: "Cannot create user" });
  }
});

router.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await getAuth();
    const firebaseUID = decodedToken.currentUser?.uid;

    // Fetch user from database
    const user = await UserModel.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ user });
  } catch (error) {
    res.status(401).send({ error: 'Invalid token' });
  }
});
// router.patch(
//   "/:uid/password",
//   requireSignedIn,
//   requireAdmin,
//   UserValidator.changeUserPassword,
//   UserController.changeUserPassword,
// );
// router.post(
//   "/notifyResetPassword",
//   requireSignedIn,
//   requireStaffOrAdmin,
//   UserController.notifyResetPassword,
// );
// router.delete("/:uid", requireSignedIn, requireAdmin, UserController.deleteUser);

export default router;