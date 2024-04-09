import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import Background from './Background'
import Footer from './Footer'
import Navbar from './Navbar'
import './globals.css'

const navigation_app = [
  { name: 'Docs', href: 'https://docs.lastic.xyz/', current: false },
  { name: 'Articles', href: '/articles', current: true },
  { name: 'FAQ', href: '/faq', current: false },
]

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syne',
})

const dm_sans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-dm_sans',
})

export const metadata: Metadata = {
  title: 'Lastic',
  description: 'Blockspace marketplace for Polkadot.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dm_sans.variable} ${syne.variable}`}>
        <Background>
          <Navbar navigation={navigation_app} />
          <div className="py-5 font-dm_sans">
            <main>{children}</main>
          </div>
          <Footer />
        </Background>
      </body>
    </html>
  )
}
