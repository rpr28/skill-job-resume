import { NextResponse } from "next/server";
import { verifyJWT } from "../../../../../lib/auth/jwt";
import { prisma } from "../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);

    // Check if user is employer or the candidate themselves
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const candidateId = params.candidateId;

    if (user.role !== 'employer' && userId !== candidateId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get candidate's skill verifications
    const skillVerifications = await prisma.skillVerification.findMany({
      where: { userId: candidateId },
      include: {
        skill: true,
        testResult: {
          include: {
            test: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get candidate info
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Format results
    const results = skillVerifications.map(sv => ({
      skill: sv.skill.name,
      category: sv.skill.category,
      verified: sv.isVerified,
      score: sv.score,
      verifiedAt: sv.verifiedAt,
      testResult: sv.testResult ? {
        id: sv.testResult.id,
        timeSpent: sv.testResult.timeSpent,
        tabSwitches: sv.testResult.tabSwitches,
        submittedAt: sv.testResult.submittedAt
      } : null
    }));

    return NextResponse.json({
      candidate,
      skillVerifications: results,
      summary: {
        totalSkills: results.length,
        verifiedSkills: results.filter(r => r.verified).length,
        averageScore: results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length || 0
      }
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
