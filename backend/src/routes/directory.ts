// src/routes/directoryRoutes.ts
import express from "express";

import * as DirectoryController from "../controllers/directory";

const router = express.Router();

router.post("/approve", DirectoryController.approveDirectoryEntry);
router.post("/deny", DirectoryController.denyDirectoryEntry);

export default router;
