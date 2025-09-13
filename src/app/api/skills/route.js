import { NextResponse } from "next/server";
import { verifyJWT } from "../../../lib/auth/jwt";
import { prisma } from "../../../lib/db";

// GET /api/skills - Get all skills
export async function GET(req) {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

// POST /api/skills - Create a new skill (admin only)
export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);
    
    // Check if user is admin (you can implement proper admin check)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'employer') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, description } = body;

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        description
      }
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
