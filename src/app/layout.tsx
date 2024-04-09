
import type { Metadata } from 'next';
import './globals.scss'
import '../assets/scss/main.scss'


export const metadata: Metadata = {
  title: 'MindMoney',
  description: "MoneyMind, your online financial companion. Easily track and manage your daily and monthly expenses. Explore detailed statistics and customize categories for complete control over your finances. Simplify your money management with MoneyMind.",
  keywords: 'Expense Tracker, Financial Management, Budgeting App, Money Manager, Personal Finance',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',

  },
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
      <body>{children}</body>
    </html>
  );
}
