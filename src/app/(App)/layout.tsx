'use client'

import './globals.css'
//import type { Metadata } from 'next'
import { env } from '@/config/environment'
import { CogIcon, HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { UseInkathonProvider } from '@poppyseed/lastic-sdk'
import { Montserrat, Syncopate } from 'next/font/google'
import Background from './Background'
import Navbar from './Navbar'

const navigation_app = [
  {
    name: 'My cores',
    icon: <HomeIcon className="h-5 w-5" aria-hidden="true" />,
    href: '/my-cores',
    current: false,
  },
  {
    name: 'Insta-core',
    icon: <HomeIcon className="h-5 w-5" aria-hidden="true" />,
    href: '/instacore',
    current: false,
  },
  {
    name: '1. Bulk-core',
    icon: <UserGroupIcon className="h-5 w-5" aria-hidden="true" />,
    href: '/bulkcore1',
    current: false,
  },
  {
    name: '2. Bulk-core',
    icon: <CogIcon className="h-5 w-5" aria-hidden="true" />,
    href: '/bulkcore2',
    current: false,
  },
  {
    name: 'test',
    icon: <CogIcon className="h-5 w-5" aria-hidden="true" />,
    href: '/test',
    current: false,
  },
  {
    name: 'Teleport assets',
    icon: <CogIcon className="h-5 w-5" aria-hidden="true" />,
    href: '/teleport',
    current: false,
  },
]

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-montserrat',
})

// export const metadata: Metadata = {
//   title: 'Lastic',
//   description: 'Blockspace marketplace for Polkadot.',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syncopate.variable} ${montserrat.variable}`}>
        <Background>
          <UseInkathonProvider
            appName="lastic" // TODO
            connectOnInit={true}
            defaultChain={env.defaultChain}
            relayChain={env.relayChain}
          >
            <Navbar navigation={navigation_app}>
              <div className="py-10">
                <main>{children}</main>
              </div>
            </Navbar>
          </UseInkathonProvider>
        </Background>
      </body>
    </html>
  )
}
