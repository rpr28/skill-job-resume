import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth/jwt";

// DELETE /api/applications/[id] - Remove a saved job
export async function DELETE(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await verifyJWT(token);
    const { id } = params;

    // Verify the application belongs to the user
    const application = await prisma.application.findFirst({
      where: { 
        id,
        userId
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await prisma.application.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Application DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
