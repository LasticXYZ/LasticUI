import type { Metadata } from 'next'
import { Syncopate } from 'next/font/google'
import localFont from 'next/font/local'
import Background from './Background'
import Footer from './Footer'
import Navbar from './Navbar'
import './globals.css'

const montserrat = localFont({
  src: [
    {
      path: '../../../public/assets/Fonts/Montserrat-VariableFont_wght.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/assets/Fonts/Montserrat-Italic-VariableFont_wght.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../../public/assets/Fonts/Montserrat-VariableFont_wght.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/assets/Fonts/Montserrat-Italic-VariableFont_wght.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
})

const navigation_app = [
  { name: 'Docs', href: 'https://docs.lastic.xyz/', current: false },
  { name: 'Articles', href: '/articles', current: true },
  { name: 'FAQ', href: '/faq', current: false },
]

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
})

export const metadata: Metadata = {
  title: 'Lastic',
  description: 'Blockspace marketplace for Polkadot.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syncopate.variable} ${montserrat.className}`}>
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
