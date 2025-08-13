import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "@/lib/auth/hash";
import { signJWT } from "@/lib/auth/jwt";
export async function POST(req){
  const { email, password, name } = await req.json();
  if(!email || !password) return NextResponse.json({ error:"Missing" }, { status:400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if(exists) return NextResponse.json({ error:"Email in use" }, { status:409 });
  const user = await prisma.user.create({ data: { email, password: await hash(password), name } });
  const token = await signJWT({ userId: user.id, email: user.email });
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}
