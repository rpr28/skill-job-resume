import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db";
import { idemCheck } from "@/lib/redis";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);
    const key = req.headers.get("idempotency-key");
    if (key && !(await idemCheck(`resume:${userId}:${key}`, 3600))) {
      return NextResponse.json({ ok: true, idempotent: true }); // duplicate ignored
    }
    const body = await req.json();
    const saved = await prisma.resume.create({ data: { userId, data: body } });
    return NextResponse.json({ id: saved.id });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
