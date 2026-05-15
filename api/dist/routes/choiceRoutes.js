"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const choiceController_1 = require("../controllers/choiceController");
const router = (0, express_1.Router)();
router.post("/", choiceController_1.createChoice);
exports.default = router;
//# sourceMappingURL=choiceRoutes.js.map