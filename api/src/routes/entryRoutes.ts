import { Router } from "express";
import {
  createEntry,
  updateEntry,
  getEntries,
  getEntry,
  deleteEntry,
} from "../controllers/entryController";

const router = Router();

router.post("/", createEntry);
router.put("/:entryId", updateEntry);
router.get("/user/:userId", getEntries);
router.get("/:entryId", getEntry);
router.delete("/:entryId", deleteEntry);

export default router;
