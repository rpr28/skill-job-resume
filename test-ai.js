// Simple test script to verify AI functionality
const { scoreMatch } = require('./src/lib/ai/embeddings-server.ts');

async function testAI() {
  console.log('Testing AI Resume Assistant...');
  
  // Test ATS scoring
  const resumeText = "Experienced software engineer with 5 years of experience in JavaScript, React, and Node.js. Led development of multiple web applications and mentored junior developers.";
  const jobText = "We are looking for a senior software engineer with experience in JavaScript, React, and Node.js. The ideal candidate should have 3+ years of experience and leadership skills.";
  
  try {
    const result = await scoreMatch(resumeText, jobText);
    console.log('ATS Score Test:', result);
    console.log('✅ AI functionality is working!');
  } catch (error) {
    console.error('❌ AI test failed:', error);
  }
}

testAI();
