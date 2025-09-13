import { NextResponse } from "next/server";
import { verifyJWT } from "../../../../../lib/auth/jwt";
import { prisma } from "../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);

    const testId = params.testId;

    // Get test details
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { skill: true }
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Parse questions
    const questions = JSON.parse(test.questions);

    return NextResponse.json({
      id: test.id,
      title: test.title,
      description: test.description,
      type: test.type,
      difficulty: test.difficulty,
      timeLimit: test.timeLimit,
      skill: test.skill.name,
      questions
    });

  } catch (error) {
    console.error('Error fetching test details:', error);
    return NextResponse.json({ error: "Failed to fetch test details" }, { status: 500 });
  }
}
