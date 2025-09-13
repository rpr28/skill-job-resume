import { NextResponse } from "next/server";
import { seedSkills } from "../../../../lib/skills/seedSkills";

export async function POST(req) {
  try {
    const result = await seedSkills();
    
    if (result.success) {
      return NextResponse.json({ 
        message: `Successfully seeded ${result.count} skills`,
        count: result.count 
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in seed endpoint:', error);
    return NextResponse.json({ error: "Failed to seed skills" }, { status: 500 });
  }
}
