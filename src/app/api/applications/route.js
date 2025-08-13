import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth/jwt";

// GET /api/applications - Get user's saved jobs
export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await verifyJWT(token);
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      applications: applications.map(app => ({
        ...app,
        job: JSON.parse(app.job)
      }))
    });
  } catch (error) {
    console.error("Applications GET error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// POST /api/applications - Save a job
export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await verifyJWT(token);
    const { job, status = "saved", notes } = await req.json();

    if (!job) {
      return NextResponse.json({ error: "Job data is required" }, { status: 400 });
    }

    // Check if job is already saved
    const existing = await prisma.application.findFirst({
      where: { 
        userId,
        job: JSON.stringify(job)
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Job already saved" }, { status: 409 });
    }

    const application = await prisma.application.create({
      data: {
        userId,
        job: JSON.stringify(job),
        status,
        notes
      }
    });

    return NextResponse.json({ 
      application: {
        ...application,
        job: JSON.parse(application.job)
      }
    });
  } catch (error) {
    console.error("Applications POST error:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}
