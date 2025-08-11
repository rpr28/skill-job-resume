export type Course = {
  id: string;
  title: string;
  platform: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  url: string;
  affiliate_url?: string;
  category?: string;
};

export const courses: Course[] = [
  { id: 'c1', title: 'Machine Learning', platform: 'Coursera', level: 'Beginner', duration: '11 weeks', url: 'https://www.coursera.org/learn/machine-learning', category: 'AI/ML' },
  { id: 'c2', title: 'Deep Learning Specialization', platform: 'Coursera', level: 'Intermediate', duration: '5 courses', url: 'https://www.coursera.org/specializations/deep-learning', category: 'AI/ML' },
  { id: 'c3', title: 'The Web Developer Bootcamp', platform: 'Udemy', level: 'Beginner', duration: '60 hours', url: 'https://www.udemy.com/course/the-web-developer-bootcamp', category: 'Web Development' },
  { id: 'c4', title: 'System Design Fundamentals', platform: 'Udemy', level: 'Intermediate', duration: '12 hours', url: 'https://www.udemy.com/topic/system-design/', category: 'Systems' },
  { id: 'c5', title: 'Data Structures and Algorithms', platform: 'Coursera', level: 'Beginner', duration: 'weeks', url: 'https://www.coursera.org/specializations/data-structures-algorithms', category: 'DSA' },
  { id: 'c6', title: 'Cloud Practitioner Essentials', platform: 'AWS', level: 'Beginner', duration: '10 hours', url: 'https://www.aws.training', category: 'Cloud' },
  { id: 'c7', title: 'Docker & Kubernetes', platform: 'Udemy', level: 'Intermediate', duration: '20 hours', url: 'https://www.udemy.com/topic/kubernetes/', category: 'Cloud' },
  { id: 'c8', title: 'NPTEL Python for Data Science', platform: 'NPTEL', level: 'Beginner', duration: '12 weeks', url: 'https://nptel.ac.in/courses', category: 'Data Science' },
  { id: 'c9', title: 'Generative AI with LLMs', platform: 'Coursera', level: 'Advanced', duration: '4 weeks', url: 'https://www.coursera.org/learn/generative-ai-with-llms', category: 'AI/ML' },
  { id: 'c10', title: 'Frontend React', platform: 'Udemy', level: 'Beginner', duration: '40 hours', url: 'https://www.udemy.com/topic/react/', category: 'Web Development' },
  { id: 'c11', title: 'SQL for Data Analysis', platform: 'Coursera', level: 'Beginner', duration: '4 weeks', url: 'https://www.coursera.org/courses?query=sql', category: 'Data' },
  { id: 'c12', title: 'Object Oriented Design', platform: 'Coursera', level: 'Intermediate', duration: '4 weeks', url: 'https://www.coursera.org/courses?query=object%20oriented%20design', category: 'Software Engineering' },
  { id: 'c13', title: 'UX Research Fundamentals', platform: 'Coursera', level: 'Beginner', duration: '4 weeks', url: 'https://www.coursera.org/courses?query=ux%20research', category: 'Design' },
  { id: 'c14', title: 'Prompt Engineering', platform: 'Udemy', level: 'Beginner', duration: '6 hours', url: 'https://www.udemy.com/topic/prompt-engineering/', category: 'AI/ML' },
  { id: 'c15', title: 'Effective Communication', platform: 'Coursera', level: 'Beginner', duration: '8 hours', url: 'https://www.coursera.org/courses?query=communication', category: 'Soft Skills' },
  { id: 'c16', title: 'Leadership Essentials', platform: 'Coursera', level: 'Intermediate', duration: '6 hours', url: 'https://www.coursera.org/courses?query=leadership', category: 'Soft Skills' },
  { id: 'c17', title: 'DevOps Foundations', platform: 'Udemy', level: 'Beginner', duration: '10 hours', url: 'https://www.udemy.com/topic/devops/', category: 'DevOps' },
  { id: 'c18', title: 'Computer Networks', platform: 'NPTEL', level: 'Intermediate', duration: '12 weeks', url: 'https://nptel.ac.in/courses', category: 'Systems' },
  { id: 'c19', title: 'Cybersecurity Basics', platform: 'Coursera', level: 'Beginner', duration: '10 hours', url: 'https://www.coursera.org/courses?query=cybersecurity', category: 'Security' },
  { id: 'c20', title: 'Business Analytics', platform: 'Coursera', level: 'Beginner', duration: 'weeks', url: 'https://www.coursera.org/courses?query=business%20analytics', category: 'Data' },
  { id: 'c21', title: 'AI for Everyone', platform: 'Coursera', level: 'Beginner', duration: '6 hours', url: 'https://www.coursera.org/learn/ai-for-everyone', category: 'AI/ML' },
  { id: 'c22', title: 'Web Accessibility', platform: 'Udemy', level: 'Intermediate', duration: '6 hours', url: 'https://www.udemy.com/topic/web-accessibility/', category: 'Web Development' },
  { id: 'c23', title: 'Data Visualization', platform: 'Coursera', level: 'Beginner', duration: '4 weeks', url: 'https://www.coursera.org/courses?query=data%20visualization', category: 'Data' },
  { id: 'c24', title: 'Operating Systems', platform: 'NPTEL', level: 'Intermediate', duration: '12 weeks', url: 'https://nptel.ac.in/courses', category: 'Systems' },
  { id: 'c25', title: 'Cloud Architect', platform: 'Udemy', level: 'Advanced', duration: '30 hours', url: 'https://www.udemy.com/topic/cloud-architecture/', category: 'Cloud' },
  { id: 'c26', title: 'Product Management', platform: 'Coursera', level: 'Beginner', duration: 'weeks', url: 'https://www.coursera.org/courses?query=product%20management', category: 'Product' },
  { id: 'c27', title: 'Time Management', platform: 'Udemy', level: 'Beginner', duration: '3 hours', url: 'https://www.udemy.com/topic/time-management/', category: 'Soft Skills' },
  { id: 'c28', title: 'Intro to NLP', platform: 'Coursera', level: 'Intermediate', duration: '4 weeks', url: 'https://www.coursera.org/courses?query=nlp', category: 'AI/ML' },
  { id: 'c29', title: 'Clean Code', platform: 'Udemy', level: 'Intermediate', duration: '8 hours', url: 'https://www.udemy.com/topic/clean-code/', category: 'Software Engineering' },
  { id: 'c30', title: 'Agile with Jira', platform: 'Coursera', level: 'Beginner', duration: '10 hours', url: 'https://www.coursera.org/courses?query=jira', category: 'Product' },
];
