import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NameFlow',
  description: 'NameFlow - Decentralized Name Service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-indigo-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              NameFlow
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-indigo-200">
                Home
              </Link>
              <Link href="/aiagent" className="hover:text-indigo-200">
                AI Agent
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
