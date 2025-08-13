# CareerBoost - AI Resume Builder & Job Search

A modern web application for building ATS-friendly resumes, automating job search alerts, and upskilling with curated courses.

## Features

- **Resume Builder**: Create professional resumes with multiple templates
- **Job Search**: Automated job matching based on your resume
- **Course Directory**: Curated learning resources for career growth
- **Dashboard**: Track your progress and saved data

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Language**: JavaScript (converted from TypeScript)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── data/               # Static data (jobs, courses)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── utils/              # Helper utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Conversion Notes

This project was converted from TypeScript to JavaScript. All type annotations have been removed while maintaining the same functionality. The project uses:

- `jsconfig.json` instead of `tsconfig.json`
- `.js` and `.jsx` file extensions
- No TypeScript dependencies

## License

MIT
