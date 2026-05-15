"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailablePrompts = void 0;
const index_1 = require("../index");
const getAvailablePrompts = async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = 5; // Number of prompts to return for deck
        // Get recent choices to exclude from results
        const recentChoices = await index_1.prisma.choice.findMany({
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
        const prompts = await index_1.prisma.prompt.findMany({
            where: {
                id: {
                    notIn: recentPromptIds,
                },
            },
            take: limit,
        });
        res.json(prompts);
    }
    catch (error) {
        console.error("Error fetching prompts:", error);
        res.status(500).json({ error: "Failed to fetch prompts" });
    }
};
exports.getAvailablePrompts = getAvailablePrompts;
//# sourceMappingURL=promptController.js.map