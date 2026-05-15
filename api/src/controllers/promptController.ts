import { Request, Response } from "express";
import { prisma } from "../index";

export const getAvailablePrompts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = 5; // Number of prompts to return for deck

    // Get recent choices to exclude from results
    const recentChoices = await prisma.choice.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const recentPromptIds = recentChoices.map((c) => c.promptId);

    // Fetch available prompts
    const prompts = await prisma.prompt.findMany({
      where: {
        id: {
          notIn: recentPromptIds,
        },
      },
      take: limit,
    });

    res.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
};
