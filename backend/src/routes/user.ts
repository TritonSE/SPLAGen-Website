import express from "express";

import * as UserController from "../controllers/user";

const router = express.Router();

router.get("/personal-information", UserController.getPersonalInformation);
router.post("/personal-information", UserController.editPersonalInformation); //change to post

router.get("/professional-information", UserController.getProfessionalInformation);
router.post("/professional-information", UserController.editProfessionalInformation);

router.get("/directory/personal-information", UserController.getDirectoryPersonalInformation);
router.post("/directory/personal-information", UserController.editDirectoryPersonalInformation);

router.get("/directory/display-info", UserController.getDirectoryDisplayInfo);
router.post("/directory/display-info", UserController.editDirectoryDisplayInfo);

export default router;
