import { NextResponse } from "next/server";
import { verifyJWT } from "../../../../lib/auth/jwt";
import { prisma } from "../../../../lib/db";
import { calculateTestScore } from "../../../../lib/skills/testScorer";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);

    const body = await req.json();
    const { testId, answers, timeSpent, tabSwitches = 0 } = body;

    if (!testId || !answers) {
      return NextResponse.json({ error: "Test ID and answers are required" }, { status: 400 });
    }

    // Get the test to validate answers
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { skill: true }
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Calculate score
    const questions = JSON.parse(test.questions);
    const score = calculateTestScore(questions, answers);
    const isVerified = score >= 70; // 70% threshold for verification

    // Save test result
    const testResult = await prisma.testResult.create({
      data: {
        userId,
        testId,
        answers: JSON.stringify(answers),
        score,
        timeSpent,
        tabSwitches,
        isVerified
      }
    });

    // Create or update skill verification
    const skillVerification = await prisma.skillVerification.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: test.skillId
        }
      },
      update: {
        testResultId: testResult.id,
        isVerified,
        score,
        verifiedAt: isVerified ? new Date() : null
      },
      create: {
        userId,
        skillId: test.skillId,
        testResultId: testResult.id,
        isVerified,
        score,
        verifiedAt: isVerified ? new Date() : null
      }
    });

    return NextResponse.json({
      testResultId: testResult.id,
      score,
      isVerified,
      skillName: test.skill.name,
      message: isVerified ? "Skill verified successfully!" : "Skill not verified. Try again to improve your score."
    });

  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 });
  }
}
