"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChoice = void 0;
const index_1 = require("../index");
const createChoice = async (req, res) => {
    try {
        const { userId, promptId, decision } = req.body;
        // Validate inputs
        if (!userId || !promptId || !decision) {
            return res
                .status(400)
                .json({ error: "Missing required fields: userId, promptId, decision" });
        }
        const validDecisions = ["ACCEPT", "REJECT", "DELAY"];
        if (!validDecisions.includes(decision)) {
            return res.status(400).json({
                error: `Invalid decision. Must be one of: ${validDecisions.join(", ")}`,
            });
        }
        // Verify user exists
        const user = await index_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Verify prompt exists
        const prompt = await index_1.prisma.prompt.findUnique({
            where: { id: promptId },
        });
        if (!prompt) {
            return res.status(404).json({ error: "Prompt not found" });
        }
        // Create or update choice
        const choice = await index_1.prisma.choice.upsert({
            where: {
                userId_promptId: {
                    userId,
                    promptId,
                },
            },
            update: {
                decision,
            },
            create: {
                userId,
                promptId,
                decision,
            },
        });
        res.status(201).json(choice);
    }
    catch (error) {
        console.error("Error creating choice:", error);
        res.status(500).json({ error: "Failed to create choice" });
    }
};
exports.createChoice = createChoice;
//# sourceMappingURL=choiceController.js.map