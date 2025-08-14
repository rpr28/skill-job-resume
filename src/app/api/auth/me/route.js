import { NextResponse } from "next/server";
import { verifyJWT } from "../../../lib/auth/jwt";
import { prisma } from "../../../lib/db";
export async function GET(req){
  try{
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id:true, email:true, name:true } });
    return NextResponse.json({ user });
  }catch{ return NextResponse.json({ error:"Unauthorized" }, { status:401 }); }
}
