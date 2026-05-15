"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntry = exports.getEntry = exports.getEntries = exports.updateEntry = exports.createEntry = void 0;
const index_1 = require("../index");
const createEntry = async (req, res) => {
    try {
        const { userId, promptId, content } = req.body;
        // Validate inputs
        if (!userId || content === undefined) {
            return res
                .status(400)
                .json({ error: "Missing required fields: userId, content" });
        }
        // Verify user exists
        const user = await index_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Verify prompt exists if provided
        if (promptId) {
            const prompt = await index_1.prisma.prompt.findUnique({
                where: { id: promptId },
            });
            if (!prompt) {
                return res.status(404).json({ error: "Prompt not found" });
            }
        }
        // Create entry
        const entry = await index_1.prisma.entry.create({
            data: {
                userId,
                promptId: promptId || null,
                content,
            },
        });
        res.status(201).json(entry);
    }
    catch (error) {
        console.error("Error creating entry:", error);
        res.status(500).json({ error: "Failed to create entry" });
    }
};
exports.createEntry = createEntry;
const updateEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const { content } = req.body;
        if (!content && content !== "") {
            return res.status(400).json({ error: "Missing required field: content" });
        }
        // Verify entry exists
        const entry = await index_1.prisma.entry.findUnique({
            where: { id: parseInt(entryId) },
        });
        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }
        // Update entry
        const updated = await index_1.prisma.entry.update({
            where: { id: parseInt(entryId) },
            data: { content },
        });
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating entry:", error);
        res.status(500).json({ error: "Failed to update entry" });
    }
};
exports.updateEntry = updateEntry;
const getEntries = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        // Verify user exists
        const user = await index_1.prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Get total count
        const total = await index_1.prisma.entry.count({
            where: { userId: parseInt(userId) },
        });
        // Get paginated entries
        const entries = await index_1.prisma.entry.findMany({
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
    }
    catch (error) {
        console.error("Error fetching entries:", error);
        res.status(500).json({ error: "Failed to fetch entries" });
    }
};
exports.getEntries = getEntries;
const getEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const entry = await index_1.prisma.entry.findUnique({
            where: { id: parseInt(entryId) },
            include: {
                prompt: true,
            },
        });
        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }
        res.json(entry);
    }
    catch (error) {
        console.error("Error fetching entry:", error);
        res.status(500).json({ error: "Failed to fetch entry" });
    }
};
exports.getEntry = getEntry;
const deleteEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        // Verify entry exists
        const entry = await index_1.prisma.entry.findUnique({
            where: { id: parseInt(entryId) },
        });
        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }
        // Delete entry
        await index_1.prisma.entry.delete({
            where: { id: parseInt(entryId) },
        });
        res.json({ message: "Entry deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting entry:", error);
        res.status(500).json({ error: "Failed to delete entry" });
    }
};
exports.deleteEntry = deleteEntry;
//# sourceMappingURL=entryController.js.map