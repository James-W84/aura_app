"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const promptRoutes_1 = __importDefault(require("./routes/promptRoutes"));
const choiceRoutes_1 = __importDefault(require("./routes/choiceRoutes"));
const entryRoutes_1 = __importDefault(require("./routes/entryRoutes"));
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Initialize Prisma Client
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
// Routes
app.use("/prompts", promptRoutes_1.default);
app.use("/choices", choiceRoutes_1.default);
app.use("/entries", entryRoutes_1.default);
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
    });
});
// Graceful shutdown
const server = app.listen(port, () => {
    console.log(`[Aura API] Server is running at http://localhost:${port}`);
});
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(async () => {
        console.log("HTTP server closed");
        await exports.prisma.$disconnect();
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map