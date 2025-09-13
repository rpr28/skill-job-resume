import { NextResponse } from "next/server";
import { verifyJWT } from "../../../../lib/auth/jwt";
import { prisma } from "../../../../lib/db";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);

    // Check if user is employer
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'employer') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all candidates with their skill verification counts
    const candidates = await prisma.user.findMany({
      where: { role: 'candidate' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        skillVerifications: {
          select: {
            isVerified: true,
            score: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add summary data
    const candidatesWithSummary = candidates.map(candidate => ({
      ...candidate,
      skillCount: candidate.skillVerifications.length,
      verifiedCount: candidate.skillVerifications.filter(sv => sv.isVerified).length,
      averageScore: candidate.skillVerifications.length > 0 
        ? Math.round(candidate.skillVerifications.reduce((sum, sv) => sum + (sv.score || 0), 0) / candidate.skillVerifications.length)
        : 0
    }));

    return NextResponse.json({ candidates: candidatesWithSummary });

  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}
