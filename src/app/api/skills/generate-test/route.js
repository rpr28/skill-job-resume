import { NextResponse } from "next/server";
import { verifyJWT } from "../../../../lib/auth/jwt";
import { prisma } from "../../../../lib/db";
import { generateTestForSkills } from "../../../../lib/skills/testGenerator";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);

    const body = await req.json();
    const { skills, difficulty = 'intermediate' } = body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: "Skills array is required" }, { status: 400 });
    }

    // Generate test for each skill
    const tests = [];
    for (const skillName of skills) {
      // Find or create skill
      let skill = await prisma.skill.findUnique({ where: { name: skillName } });
      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            name: skillName,
            category: 'Technical', // Default category
            description: `Technical skill: ${skillName}`
          }
        });
      }

      // Generate test questions for this skill
      const testQuestions = await generateTestForSkills(skillName, difficulty);
      
      // Create test in database
      const test = await prisma.test.create({
        data: {
          skillId: skill.id,
          title: `${skillName} Assessment`,
          description: `Test your ${skillName} skills`,
          type: testQuestions.type,
          difficulty,
          timeLimit: testQuestions.timeLimit || 30,
          questions: JSON.stringify(testQuestions.questions)
        }
      });

      tests.push({
        testId: test.id,
        skillName: skill.name,
        title: test.title,
        timeLimit: test.timeLimit,
        questionCount: testQuestions.questions.length
      });
    }

    return NextResponse.json({
      tests,
      message: "Tests generated successfully"
    });

  } catch (error) {
    console.error('Error generating tests:', error);
    return NextResponse.json({ error: "Failed to generate tests" }, { status: 500 });
  }
}
