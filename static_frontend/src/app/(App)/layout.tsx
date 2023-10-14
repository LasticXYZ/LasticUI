import './globals.css'
import type { Metadata } from 'next'
import { Syncopate, Montserrat } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Background from '@/components/Background'

const navigation_app = [
    { name: 'Insta-core', href: '/instacore', current: false },
    { name: '1. Bulk-core', href: '/bulkcore1', current: false },
    { name: '2. Bulk-core', href: '/bulkcore2', current: false },
  ]


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
      <body className={`${syncopate.variable} ${montserrat.variable}`}>
        <Background>
          <Navbar navigation={navigation_app}/>
          <div className="py-10">
            <main>{children}</main>
          </div>
        </Background>
      </body>
    </html>
  )
}

