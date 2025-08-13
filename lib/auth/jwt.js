import * as jose from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-change-me");
export async function signJWT(payload, exp = "7d") {
  return await new jose.SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(exp).sign(secret);
}
export async function verifyJWT(token) {
  if (!token) throw new Error("No token");
  const { payload } = await jose.jwtVerify(token, secret);
  return payload; // { userId, email }
}
