import type { Metadata } from 'next'
import { Montserrat, Unbounded } from 'next/font/google'
import Background from './Background'
import Footer from './Footer'
import Navbar from './Navbar'
import './globals.css'

const navigation_app = [
  { name: 'Docs', href: 'https://docs.lastic.xyz/', current: false },
  { name: 'Articles', href: '/articles', current: true },
  { name: 'FAQ', href: '/faq', current: false },
]

// const syncopate = Syncopate({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-unbounded',
// })

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-unbounded',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Lastic',
  description: 'Blockspace marketplace for Polkadot.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${unbounded.variable}`}>
        <Background>
          <Navbar navigation={navigation_app} />
          <div className="py-5 font-montserrat">
            <main>{children}</main>
          </div>
          <Footer />
        </Background>
      </body>
    </html>
  )
}
