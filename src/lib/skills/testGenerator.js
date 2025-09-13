// Modular test generation engine
// This can be extended to use AI-generated questions later

const TEST_QUESTIONS = {
  'React': {
    coding: [
      {
        id: 'react-1',
        question: 'Create a functional component called Counter that displays a number and has increment/decrement buttons.',
        code: `// Write your React component here
function Counter() {
  // Your code here
}`,
        testCases: [
          { input: 'initial render', expected: 'displays 0' },
          { input: 'click increment', expected: 'displays 1' },
          { input: 'click decrement', expected: 'displays -1' }
        ],
        points: 20
      }
    ],
    mcq: [
      {
        id: 'react-mcq-1',
        question: 'What is the correct way to update state in a functional component?',
        options: [
          'this.setState({ count: 1 })',
          'setCount(1)',
          'state.count = 1',
          'this.state.count = 1'
        ],
        correct: 1,
        points: 10
      },
      {
        id: 'react-mcq-2',
        question: 'Which hook is used to perform side effects in functional components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correct: 1,
        points: 10
      }
    ]
  },
  'JavaScript': {
    coding: [
      {
        id: 'js-1',
        question: 'Write a function that takes an array of numbers and returns the sum of all even numbers.',
        code: `function sumEvenNumbers(numbers) {
  // Your code here
}`,
        testCases: [
          { input: '[1, 2, 3, 4, 5]', expected: '6' },
          { input: '[2, 4, 6, 8]', expected: '20' },
          { input: '[1, 3, 5]', expected: '0' }
        ],
        points: 20
      }
    ],
    mcq: [
      {
        id: 'js-mcq-1',
        question: 'What is the difference between let and var?',
        options: [
          'No difference',
          'let has block scope, var has function scope',
          'var has block scope, let has function scope',
          'let is only for numbers'
        ],
        correct: 1,
        points: 10
      }
    ]
  },
  'Node.js': {
    coding: [
      {
        id: 'node-1',
        question: 'Create a simple Express server that responds with "Hello World" on the root route.',
        code: `const express = require('express');
const app = express();

// Your code here

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
        testCases: [
          { input: 'GET /', expected: 'Hello World' }
        ],
        points: 20
      }
    ],
    mcq: [
      {
        id: 'node-mcq-1',
        question: 'What is the purpose of package.json in a Node.js project?',
        options: [
          'To store application data',
          'To define project metadata and dependencies',
          'To configure the database',
          'To store user preferences'
        ],
        correct: 1,
        points: 10
      }
    ]
  },
  'SQL': {
    coding: [
      {
        id: 'sql-1',
        question: 'Write a SQL query to find all users who have made more than 5 orders.',
        code: `-- Your SQL query here
SELECT * FROM users 
WHERE id IN (
  -- Your subquery here
);`,
        testCases: [
          { input: 'users with >5 orders', expected: 'returns correct users' }
        ],
        points: 20
      }
    ],
    mcq: [
      {
        id: 'sql-mcq-1',
        question: 'Which SQL keyword is used to filter records?',
        options: ['SELECT', 'WHERE', 'FROM', 'GROUP BY'],
        correct: 1,
        points: 10
      }
    ]
  }
};

export async function generateTestForSkills(skillName, difficulty = 'intermediate') {
  const skillQuestions = TEST_QUESTIONS[skillName];
  
  if (!skillQuestions) {
    // Fallback generic questions
    return {
      type: 'mixed',
      timeLimit: 30,
      questions: [
        {
          id: 'generic-1',
          type: 'mcq',
          question: `What is ${skillName} primarily used for?`,
          options: ['Web development', 'Data analysis', 'Mobile development', 'System administration'],
          correct: 0,
          points: 10
        }
      ]
    };
  }

  const questions = [];
  const timeLimit = difficulty === 'beginner' ? 20 : difficulty === 'advanced' ? 45 : 30;

  // Add coding questions
  if (skillQuestions.coding) {
    questions.push(...skillQuestions.coding.map(q => ({
      ...q,
      type: 'coding'
    })));
  }

  // Add MCQ questions
  if (skillQuestions.mcq) {
    questions.push(...skillQuestions.mcq.map(q => ({
      ...q,
      type: 'mcq'
    })));
  }

  // Randomize question order
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

  return {
    type: questions.some(q => q.type === 'coding') ? 'mixed' : 'mcq',
    timeLimit,
    questions: shuffledQuestions
  };
}
