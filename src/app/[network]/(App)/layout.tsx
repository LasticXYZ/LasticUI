'use client'

import { Analytics } from '@vercel/analytics/react'
import './globals.css'
//import type { Metadata } from 'next'
import ThemeProvider from '@/components/themeToggle/themeProvider'
import {
  ArrowPathIcon,
  Cog8ToothIcon,
  HomeIcon,
  ShoppingCartIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid'
import { UseInkathonProvider } from '@poppyseed/lastic-sdk'
import { Montserrat, Unbounded } from 'next/font/google'
import Background from './Background'
import Navbar from './Navbar'

function getNavigation(network: string) {
  return [
    {
      name: 'My Cores',
      icon: <HomeIcon className="h-5 w-5" aria-hidden="true" />,
      href: `/${network}/my-cores`,
      current: false,
    },
    {
      name: 'Coretime Sales',
      icon: <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />,
      href: `/${network}/bulkcore1`,
      current: false,
    },
    // {
    //   name: 'Trade Cores',
    //   icon: <BanknotesIcon className="h-5 w-5" aria-hidden="true" />,
    //   href: `/${network}/listings`,
    //   current: false,
    // },
    // {
    //   name: 'On-Demand Cores',
    //   icon: <BoltIcon className="h-5 w-5" aria-hidden="true" />,
    //   href: `/${network}/instacore`,
    //   current: false,
    // },
    {
      name: 'ParaID Execution',
      icon: <Cog8ToothIcon className="h-5 w-5" aria-hidden="true" />,
      href: `/${network}/paraId`,
      current: false,
    },
    {
      name: 'Renew Core',
      icon: <WrenchIcon className="h-5 w-5" aria-hidden="true" />,
      href: `/${network}/renewal`,
      current: false,
    },
    {
      name: 'Teleport Assets',
      icon: <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />,
      href: `/${network}/teleport`,
      current: false,
    },
  ]
}

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

// export const metadata: Metadata = {
//   title: 'Lastic',
//   description: 'Blockspace marketplace for Polkadot.',
// }

export default function RootLayout({
  params,
  children,
}: {
  params: { network: string }
  children: React.ReactNode
}) {
  //const { defaultChain, relayChain } = getCurrentChain()
  const relay_chain = params.network
  const default_chain = params.network + '-coretime'

  const navigation_app = getNavigation(params.network)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${unbounded.variable}`}>
        <ThemeProvider>
          <Background>
            <UseInkathonProvider
              appName="lastic" // TODO
              connectOnInit={true}
              defaultChain={default_chain}
              relayChain={relay_chain}
            >
              <Navbar navigation={navigation_app}>
                <div className="py-10 font-montserrat">
                  <main>
                    {children}
                    <Analytics />
                  </main>
                </div>
              </Navbar>
            </UseInkathonProvider>
          </Background>
        </ThemeProvider>
      </body>
    </html>
  )
}
