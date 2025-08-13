import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verify } from "@/lib/auth/hash";
import { signJWT } from "@/lib/auth/jwt";
export async function POST(req){
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if(!user || !(await verify(password, user.password))) return NextResponse.json({ error:"Invalid credentials" }, { status:401 });
  const token = await signJWT({ userId: user.id, email: user.email });
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}
