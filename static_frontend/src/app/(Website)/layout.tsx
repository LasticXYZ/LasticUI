import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Syncopate } from 'next/font/google'
import { Layout } from '@/components'
  
const syncopate = Syncopate(
  { subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-syncopate',
  },
)

const montserrat = Montserrat(
  { subsets: ['latin'],
    weight: ['300', '400', '700'],
    variable: '--font-montserrat',
  },
)

export const metadata: Metadata = {
  title: 'Lastic',
  description: 'Blockspace marketplace for Polkadot.',
}

export default function RootLayout({
    children,
  } : {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${syncopate.variable}`}>
          <Layout>{children}</Layout>
      </body>
    </html>
  )
}

