// Seed script to populate initial skills
import { prisma } from '../db';

const SKILLS_TO_SEED = [
  // Frontend
  { name: 'React', category: 'Frontend', description: 'A JavaScript library for building user interfaces' },
  { name: 'Vue.js', category: 'Frontend', description: 'A progressive JavaScript framework' },
  { name: 'Angular', category: 'Frontend', description: 'A platform for building mobile and desktop web applications' },
  { name: 'JavaScript', category: 'Frontend', description: 'A programming language for web development' },
  { name: 'TypeScript', category: 'Frontend', description: 'A typed superset of JavaScript' },
  { name: 'HTML', category: 'Frontend', description: 'HyperText Markup Language' },
  { name: 'CSS', category: 'Frontend', description: 'Cascading Style Sheets' },
  { name: 'Next.js', category: 'Frontend', description: 'A React framework for production' },
  
  // Backend
  { name: 'Node.js', category: 'Backend', description: 'A JavaScript runtime built on Chrome\'s V8 engine' },
  { name: 'Express', category: 'Backend', description: 'A web framework for Node.js' },
  { name: 'Python', category: 'Backend', description: 'A high-level programming language' },
  { name: 'Django', category: 'Backend', description: 'A high-level Python web framework' },
  { name: 'Flask', category: 'Backend', description: 'A lightweight Python web framework' },
  { name: 'Java', category: 'Backend', description: 'A general-purpose programming language' },
  { name: 'Spring', category: 'Backend', description: 'A Java framework for building enterprise applications' },
  { name: 'PHP', category: 'Backend', description: 'A server-side scripting language' },
  { name: 'Laravel', category: 'Backend', description: 'A PHP web application framework' },
  
  // Database
  { name: 'MySQL', category: 'Database', description: 'An open-source relational database management system' },
  { name: 'PostgreSQL', category: 'Database', description: 'An advanced open-source relational database' },
  { name: 'MongoDB', category: 'Database', description: 'A NoSQL document database' },
  { name: 'Redis', category: 'Database', description: 'An in-memory data structure store' },
  { name: 'SQLite', category: 'Database', description: 'A lightweight SQL database engine' },
  { name: 'SQL', category: 'Database', description: 'Structured Query Language' },
  
  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud & DevOps', description: 'Amazon Web Services cloud platform' },
  { name: 'Docker', category: 'Cloud & DevOps', description: 'A containerization platform' },
  { name: 'Kubernetes', category: 'Cloud & DevOps', description: 'A container orchestration system' },
  { name: 'Git', category: 'Cloud & DevOps', description: 'A distributed version control system' },
  { name: 'Linux', category: 'Cloud & DevOps', description: 'An open-source operating system' },
  
  // Mobile
  { name: 'React Native', category: 'Mobile', description: 'A framework for building mobile apps with React' },
  { name: 'Flutter', category: 'Mobile', description: 'A UI toolkit for building mobile apps' },
  { name: 'Swift', category: 'Mobile', description: 'A programming language for iOS development' },
  { name: 'Kotlin', category: 'Mobile', description: 'A programming language for Android development' },
  
  // Data Science
  { name: 'Pandas', category: 'Data Science', description: 'A Python library for data manipulation and analysis' },
  { name: 'NumPy', category: 'Data Science', description: 'A Python library for numerical computing' },
  { name: 'TensorFlow', category: 'Data Science', description: 'An open-source machine learning framework' },
  { name: 'PyTorch', category: 'Data Science', description: 'An open-source machine learning library' }
];

export async function seedSkills() {
  try {
    console.log('Seeding skills...');
    
    for (const skillData of SKILLS_TO_SEED) {
      await prisma.skill.upsert({
        where: { name: skillData.name },
        update: skillData,
        create: skillData
      });
    }
    
    console.log('Skills seeded successfully!');
    return { success: true, count: SKILLS_TO_SEED.length };
  } catch (error) {
    console.error('Error seeding skills:', error);
    return { success: false, error: error.message };
  }
}
