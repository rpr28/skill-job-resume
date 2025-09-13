import { NextResponse } from "next/server";
import { verifyJWT } from "../../../../lib/auth/jwt";
import { prisma } from "../../../../lib/db";
import { extractSkillsFromResume } from "../../../../lib/skills/resumeParser";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { userId } = await verifyJWT(token);

    const formData = await req.formData();
    const file = formData.get('resume');
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer for processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract skills from resume
    const extractedSkills = await extractSkillsFromResume(buffer, file.name);

    // Store the resume file (you might want to save to cloud storage)
    const resumeData = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      extractedSkills: extractedSkills,
      uploadedAt: new Date().toISOString()
    };

    // Save resume data to database
    const resume = await prisma.resume.create({
      data: {
        userId,
        data: JSON.stringify(resumeData)
      }
    });

    return NextResponse.json({
      resumeId: resume.id,
      extractedSkills,
      message: "Resume uploaded and skills extracted successfully"
    });

  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}
