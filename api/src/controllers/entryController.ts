import { Request, Response } from "express";
import { prisma } from "../index";

export const createEntry = async (req: Request, res: Response) => {
  try {
    const { userId, promptId, content } = req.body;

    // Validate inputs
    if (!userId || content === undefined) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, content" });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify prompt exists if provided
    if (promptId) {
      const prompt = await prisma.prompt.findUnique({
        where: { id: promptId },
      });

      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
    }

    // Create entry
    const entry = await prisma.entry.create({
      data: {
        userId,
        promptId: promptId || null,
        content,
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({ error: "Failed to create entry" });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  try {
    const { entryId } = req.params;
    const { content } = req.body;

    if (!content && content !== "") {
      return res.status(400).json({ error: "Missing required field: content" });
    }

    // Verify entry exists
    const entry = await prisma.entry.findUnique({
      where: { id: parseInt(entryId) },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Update entry
    const updated = await prisma.entry.update({
      where: { id: parseInt(entryId) },
      data: { content },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ error: "Failed to update entry" });
  }
};

export const getEntries = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get total count
    const total = await prisma.entry.count({
      where: { userId: parseInt(userId) },
    });

    // Get paginated entries
    const entries = await prisma.entry.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: "desc" },
      skip: page * limit,
      take: limit,
    });

    res.json({
      entries,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

export const getEntry = async (req: Request, res: Response) => {
  try {
    const { entryId } = req.params;

    const entry = await prisma.entry.findUnique({
      where: { id: parseInt(entryId) },
      include: {
        prompt: true,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(entry);
  } catch (error) {
    console.error("Error fetching entry:", error);
    res.status(500).json({ error: "Failed to fetch entry" });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    const { entryId } = req.params;

    // Verify entry exists
    const entry = await prisma.entry.findUnique({
      where: { id: parseInt(entryId) },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Delete entry
    await prisma.entry.delete({
      where: { id: parseInt(entryId) },
    });

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ error: "Failed to delete entry" });
  }
};
