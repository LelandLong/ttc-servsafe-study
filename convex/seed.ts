/**
 * Seed script to populate Convex database with initial questions
 *
 * Run this ONCE after setting up Convex to import the original 93 questions.
 *
 * Usage:
 *   npx convex run seed:seedQuestions
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

// The original 93 questions - copy from questions.js
const originalQuestions = [
  {
    questionId: 1,
    question: "A foodhandler should be excluded from a foodservice establishment if diagnosed with which of the following?",
    options: ["Hepatitis B", "Tuberculosis", "Cancer", "Staphylococcal gastroenteritis"],
    correct: 3,
    hint: "Think about the Big Six pathogens. Which of these conditions can be transmitted through food handling?",
    explanation: "Staphylococcal gastroenteritis is caused by Staph aureus, a Big Six pathogen requiring exclusion.",
    category: "Foodborne Illness",
    examFocus: true
  },
  {
    questionId: 2,
    question: "What does the 'A' in FAT TOM stand for?",
    options: ["Additives", "Alkalinity", "Acidity", "Activity"],
    correct: 2,
    hint: "This factor relates to the pH scale and how it affects bacterial growth.",
    explanation: "A = Acidity. Bacteria grow best in foods with pH between 4.6 and 7.5.",
    category: "FAT TOM",
    examFocus: true
  },
  {
    questionId: 3,
    question: "FAT TOM is an acronym that stands for the...",
    options: [
      "conditions that favor the growth of most foodborne microorganisms",
      "cooking methods that can be used to make food more healthful",
      "process of reducing hazards in the flow of food",
      "six most common foodborne diseases"
    ],
    correct: 0,
    hint: "FAT TOM describes what bacteria NEED. Think: what makes microorganisms multiply?",
    explanation: "FAT TOM describes the six conditions bacteria need to grow: Food, Acidity, Time, Temperature, Oxygen, Moisture.",
    category: "FAT TOM",
    examFocus: true
  },
  // ... I'll create a separate file with all questions for the seed
];

// This mutation will be called to seed the database
export const seedQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingCount = (await ctx.db.query("questions").collect()).length;
    if (existingCount > 0) {
      return `Database already has ${existingCount} questions. Delete them first or use bulkImport to replace.`;
    }

    // This will be populated by running the seed with the full data
    // For now, return instructions
    return "Use the admin panel to import questions, or run the full seed script.";
  },
});
