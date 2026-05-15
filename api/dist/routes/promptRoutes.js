"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promptController_1 = require("../controllers/promptController");
const router = (0, express_1.Router)();
router.get("/available/:userId", promptController_1.getAvailablePrompts);
exports.default = router;
//# sourceMappingURL=promptRoutes.js.map