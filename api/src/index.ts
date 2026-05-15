import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import promptRoutes from "./routes/promptRoutes";
import choiceRoutes from "./routes/choiceRoutes";
import entryRoutes from "./routes/entryRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ path: ".env" });

const app: Express = express();
const port = process.env.PORT || 5000;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/prompts", promptRoutes);
app.use("/choices", choiceRoutes);
app.use("/entries", entryRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
const server = app.listen(port, () => {
  console.log(`[Aura API] ✅ Server running at http://localhost:${port}`);
  console.log(
    `[Aura API] Database: ${process.env.DATABASE_URL || "file:./dev.db"}`,
  );
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Database connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Database connection closed");
    process.exit(0);
  });
});

export default app;
