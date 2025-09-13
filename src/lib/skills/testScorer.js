// Test scoring engine
// This can be extended to use AI for more sophisticated scoring

export function calculateTestScore(questions, userAnswers) {
  let totalPoints = 0;
  let earnedPoints = 0;

  questions.forEach(question => {
    totalPoints += question.points || 10;
    
    const userAnswer = userAnswers[question.id];
    if (!userAnswer) return;

    if (question.type === 'mcq') {
      // Multiple choice scoring
      if (userAnswer === question.correct) {
        earnedPoints += question.points || 10;
      }
    } else if (question.type === 'coding') {
      // Coding question scoring (simplified)
      // In a real implementation, you'd run the code against test cases
      const code = userAnswer.code || '';
      
      // Simple heuristics for code quality
      let codeScore = 0;
      
      // Check if code contains expected patterns
      if (question.testCases) {
        question.testCases.forEach(testCase => {
          // Simple pattern matching (in real implementation, you'd execute the code)
          if (code.toLowerCase().includes(testCase.expected.toLowerCase()) ||
              code.includes('return') || 
              code.includes('function')) {
            codeScore += (question.points || 10) / question.testCases.length;
          }
        });
      }
      
      // Additional scoring based on code structure
      if (code.includes('function') || code.includes('const') || code.includes('let')) {
        codeScore += 2;
      }
      
      earnedPoints += Math.min(codeScore, question.points || 10);
    }
  });

  // Calculate percentage score
  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  
  return Math.min(percentage, 100); // Cap at 100%
}

// Helper function to validate code syntax (basic)
export function validateCodeSyntax(code, language = 'javascript') {
  try {
    if (language === 'javascript') {
      // Basic syntax validation
      new Function(code);
      return { valid: true, errors: [] };
    }
    // Add other language validations as needed
    return { valid: true, errors: [] };
  } catch (error) {
    return { 
      valid: false, 
      errors: [error.message] 
    };
  }
}

// Helper function to run test cases (simplified)
export function runTestCases(code, testCases) {
  const results = [];
  
  testCases.forEach((testCase, index) => {
    try {
      // In a real implementation, you'd safely execute the code
      // For now, we'll do basic pattern matching
      const codeLower = code.toLowerCase();
      const expectedLower = testCase.expected.toLowerCase();
      
      const passed = codeLower.includes(expectedLower) || 
                    code.includes('return') ||
                    code.includes('console.log');
      
      results.push({
        testCase: index + 1,
        passed,
        input: testCase.input,
        expected: testCase.expected,
        actual: 'Code execution not implemented in MVP'
      });
    } catch (error) {
      results.push({
        testCase: index + 1,
        passed: false,
        input: testCase.input,
        expected: testCase.expected,
        actual: error.message
      });
    }
  });
  
  return results;
}
