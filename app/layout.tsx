import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neuro Sync - AI Interview Platform',
  description: 'Master coding interviews with AI-powered practice and real-time feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} gradient h-screen w-full`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}