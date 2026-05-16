import { PrismaClient } from "@prisma/client";
import { uuid, uuidv4 } from "zod/v4";

const prisma = new PrismaClient();

const samplePrompts = [
  {
    content: "What moment today are you most proud of?",
    category: "reflection",
  },
  {
    content: "Describe a small thing that made you smile today.",
    category: "gratitude",
  },
  { content: "What would your ideal day look like?", category: "creative" },
  { content: "How are you feeling right now? Why?", category: "mental" },
  {
    content: "Write about a challenge you overcame recently.",
    category: "wellness",
  },
  {
    content: "If you could tell your younger self one thing, what would it be?",
    category: "reflection",
  },
  {
    content: "What's one thing you want to learn this week?",
    category: "creative",
  },
  { content: "Describe your perfect morning routine.", category: "wellness" },
  { content: "What brings you peace?", category: "mental" },
  { content: "Write a letter to your future self.", category: "creative" },
  { content: "What relationships matter most to you?", category: "reflection" },
  { content: "What did you appreciate about today?", category: "gratitude" },
  {
    content: "Describe a place where you feel most calm.",
    category: "wellness",
  },
  { content: "What would you do if you weren't afraid?", category: "mental" },
  { content: "Write about a person who inspires you.", category: "creative" },
  { content: "How have you grown this year?", category: "reflection" },
  {
    content: "What's something you're looking forward to?",
    category: "gratitude",
  },
  { content: "Describe your ideal week.", category: "wellness" },
  { content: "What does success mean to you?", category: "mental" },
  {
    content: "Write about a memory that makes you smile.",
    category: "creative",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create test user
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Dev User",
    },
  });

  console.log(`✅ User created: ${user.name}`);

  // Create prompts
  for (let i = 0; i < samplePrompts.length; i++) {
    const prompt = samplePrompts[i];
    await prisma.prompt.upsert({
      where: { id: i + 1 },
      update: {},
      create: { ...prompt, id: i + 1 },
    });
  }

  console.log(`✅ ${samplePrompts.length} prompts created`);

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(`❌ Seeding failed: ${e.message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
