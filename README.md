# CareerBoost - Next.js

A modern career development platform built with Next.js, featuring AI resume builder, job search automation, and curated courses.

## Features

- **Resume Builder**: Create ATS-friendly resumes with multiple templates
- **Job Search**: Search curated jobs and subscribe to alerts
- **Course Directory**: Browse curated courses from top platforms
- **Dashboard**: Track your progress and saved data
- **Blog**: Career tips and insights

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **TypeScript**: Full type safety

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── resume/         # Resume builder page
│   ├── jobs/           # Job search page
│   ├── courses/        # Course directory page
│   ├── dashboard/      # User dashboard page
│   └── blog/           # Blog page
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── resume/        # Resume-specific components
│   └── Layout.tsx     # Main layout component
├── pages/             # Page components (legacy)
├── data/              # Static data
├── hooks/             # Custom hooks
├── lib/               # Utility functions
└── utils/             # Helper utilities
```

## Deployment

This project can be deployed on Vercel, Netlify, or any platform that supports Next.js.

## License

MIT
