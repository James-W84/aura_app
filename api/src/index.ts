import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import promptRoutes from "./routes/promptRoutes";
import choiceRoutes from "./routes/choiceRoutes";
import entryRoutes from "./routes/entryRoutes";

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
  res.json({ status: "ok" });
});

// Routes
app.use("/prompts", promptRoutes);
app.use("/choices", choiceRoutes);
app.use("/entries", entryRoutes);

// Error handling middleware (must be last)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default app;
