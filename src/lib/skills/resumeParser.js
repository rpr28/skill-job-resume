// Simple resume parser to extract skills from uploaded files
// For MVP, we'll use regex matching against a predefined skill list

const SKILL_KEYWORDS = {
  'Frontend': [
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SASS', 'SCSS',
    'Bootstrap', 'Tailwind', 'jQuery', 'Redux', 'Vuex', 'Next.js', 'Nuxt.js', 'Gatsby'
  ],
  'Backend': [
    'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'PHP', 'Laravel',
    'Ruby', 'Rails', 'C#', '.NET', 'Go', 'Rust', 'Kotlin', 'Scala'
  ],
  'Database': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    'DynamoDB', 'Cassandra', 'Elasticsearch', 'Neo4j'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
    'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS'
  ],
  'Mobile': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin', 'Ionic', 'Cordova'
  ],
  'Data Science': [
    'Python', 'R', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'Jupyter', 'Tableau', 'Power BI', 'SQL'
  ],
  'Other': [
    'Git', 'GitHub', 'GitLab', 'JIRA', 'Confluence', 'Figma', 'Adobe XD',
    'Photoshop', 'Illustrator', 'Sketch'
  ]
};

export async function extractSkillsFromResume(buffer, fileName) {
  try {
    let text = '';
    
    // Simple text extraction based on file type
    if (fileName.endsWith('.txt')) {
      text = buffer.toString('utf-8');
    } else if (fileName.endsWith('.pdf')) {
      // For PDF, you'd typically use a library like pdf-parse
      // For MVP, we'll assume it's already extracted text
      text = buffer.toString('utf-8');
    } else if (fileName.endsWith('.docx')) {
      // For DOCX, you'd use a library like mammoth
      // For MVP, we'll assume it's already extracted text
      text = buffer.toString('utf-8');
    } else {
      // Fallback to treating as text
      text = buffer.toString('utf-8');
    }

    const extractedSkills = [];
    const textLower = text.toLowerCase();

    // Search for skills in each category
    for (const [category, skills] of Object.entries(SKILL_KEYWORDS)) {
      for (const skill of skills) {
        const skillLower = skill.toLowerCase();
        
        // Check for exact matches and variations
        const patterns = [
          skillLower,
          skillLower.replace(/\./g, '\\.'), // Escape dots
          skillLower + 'js', // For React -> ReactJS
          skillLower.replace('js', '') + 'js' // For React -> ReactJS
        ];

        for (const pattern of patterns) {
          const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
          if (regex.test(textLower)) {
            extractedSkills.push({
              name: skill,
              category,
              confidence: 0.8 // Simple confidence score
            });
            break; // Avoid duplicates
          }
        }
      }
    }

    // Remove duplicates and sort by category
    const uniqueSkills = extractedSkills.filter((skill, index, self) => 
      index === self.findIndex(s => s.name === skill.name)
    );

    return uniqueSkills;

  } catch (error) {
    console.error('Error extracting skills from resume:', error);
    return [];
  }
}
