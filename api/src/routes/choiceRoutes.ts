import { Router } from "express";
import { createChoice } from "../controllers/choiceController";

const router = Router();

router.post("/", createChoice);

export default router;
