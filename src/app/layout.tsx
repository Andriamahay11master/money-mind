
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss'
import '../assets/scss/main.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andriamahay IRIMANANA | Portfolio | Developer Frontend',
  description: "Experienced front-end developer with a passion for crafting responsive and user-friendly web applications. Proficient in HTML, CSS, and JavaScript, emphasizing modern frameworks like React.js. Expert in transforming design concepts into efficient, clean, and maintainable code. Collaborative team player, skilled in delivering high-quality digital experiences. Check out my portfolio to witness the fusion of creativity and technical expertise in building compelling websites.",
  keywords: 'Andriamahay, Andriamahay IRIMANANA, Andriamahay IRIMANANA Portfolio, Andriamahay IRIMANANA Developer Frontend',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}
type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children
} : LayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
