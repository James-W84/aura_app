"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entryController_1 = require("../controllers/entryController");
const router = (0, express_1.Router)();
router.post("/", entryController_1.createEntry);
router.put("/:entryId", entryController_1.updateEntry);
router.get("/user/:userId", entryController_1.getEntries);
router.get("/:entryId", entryController_1.getEntry);
router.delete("/:entryId", entryController_1.deleteEntry);
exports.default = router;
//# sourceMappingURL=entryRoutes.js.map