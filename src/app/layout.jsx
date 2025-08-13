import { Inter } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from '@/lib/auth/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CareerBoost – AI Resume, Jobs & Courses',
  description: 'CareerBoost: AI resume builder, job search automation, and curated courses.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background text-foreground antialiased ${inter.className}`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
