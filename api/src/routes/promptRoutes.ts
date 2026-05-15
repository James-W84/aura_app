import { Router } from "express";
import { getAvailablePrompts } from "../controllers/promptController";

const router = Router();

router.get("/available/:userId", getAvailablePrompts);

export default router;
