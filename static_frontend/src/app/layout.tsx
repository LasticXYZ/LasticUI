import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Syncopate } from 'next/font/google'
import { Layout } from '@/components'
  
const syncopate = Syncopate(
  { subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-syncopate',
  },
)

const roboto = Roboto(
  { subsets: ['latin'],
    weight: ['300', '400', '700'],
    variable: '--font-roboto',
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
      <body className={`${roboto.variable} ${syncopate.variable}`}>
          <Layout>{children}</Layout>
      </body>
    </html>
  )
}

