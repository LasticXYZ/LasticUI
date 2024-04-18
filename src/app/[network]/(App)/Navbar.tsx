'use client'

import ThemeToggle from '@/components/themeToggle/themeToggle'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { SideBarAccountName } from '@/components/web3/SideBarAccountName'
import SupportedChains from '@/components/web3/SupportedChains'
import { Disclosure } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { LinkIcon } from '@heroicons/react/24/solid'
import { useInkathon } from '@poppyseed/lastic-sdk'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC, useState } from 'react'

type NavbarProps = {
  navigation: Array<{ name: string; href: string; icon: React.ReactElement; current: boolean }>
  children?: React.ReactNode
}

const Navbar: FC<NavbarProps> = ({ navigation, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { activeChain } = useInkathon()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <div className="min-h-full font-montserrat">
      <Disclosure as="nav" className="">
        {({ open }) => (
          <div className="flex">
            {/* Sidebar Section */}
            <div
              className={`fixed top-0 left-0 h-screen z-10 transition-width duration-300 ${isCollapsed ? 'w-16' : 'w-56 overflow-y-auto'}`}
            >
              <div className="flex-shrink-0 flex items-center justify-between space-x-5 border-b border-gray-9 dark:border-gray-18  pl-6 pr-2 py-6 mt-2">
                {!isCollapsed && (
                  <div className="flex gap-1 items-center">
                    <div className="font-bold dark:hidden flex items-center">
                      <Image
                        src="/assets/Images/Logos/lastic-logo.png"
                        width={130}
                        height="0"
                        style={{ width: '10em', height: 'auto' }}
                        quality={100}
                        alt="Lastic Logo"
                      />
                    </div>
                    <div className="font-bold hidden dark:visible dark:flex items-center">
                      <Image
                        src="/assets/Images/Logos/lastic-logo-dark.png"
                        width={130}
                        height="0"
                        style={{ width: '10em', height: 'auto' }}
                        quality={100}
                        alt="Lastic Logo"
                      />
                    </div>

                    {/* Chevron Icon */}
                    <ChevronLeftIcon
                      className="h-4 w-5 hover:text-gray-12 cursor-pointer mt-1"
                      aria-hidden="true"
                      onClick={toggleSidebar}
                    />
                  </div>
                )}

                {isCollapsed && (
                  <div className="flex flex-col items-center">
                    <ChevronRightIcon
                      className="h-4 mb-5 w-5 hover:text-gray-12 cursor-pointer"
                      aria-hidden="true"
                      onClick={toggleSidebar}
                    />
                    <Link href="/" className="font-bold mt-3">
                      <Image
                        src="/assets/Images/Logos/lastic-small.png"
                        width={20}
                        height={20}
                        alt="lastic Logo"
                      />
                    </Link>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="text-gray-8 dark:text-gray-8 font-montserrat text-xs font-semibold px-4 pt-6">
                  OVERVIEW
                </div>
              )}
              <div className="mt-2 text-gray-18 dark:text-gray-4 flex flex-col px-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={` py-3 px-2 text-l flex flex-row items-center font-semibold transition duration-150 ease-in-out hover:text-teal-5 dark:hover:text-teal-7 hover:bg-teal-1 dark:hover:bg-teal-5  hover:bg-opacity-60 hover:rounded-2xl ${
                        item.current
                          ? 'text-gray- bg-gray-2'
                          : 'text-gray-19 dark:text-gray-6 hover:bg-gray-1'
                      }`}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <span className="px-2">{Icon}</span>

                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
              {!isCollapsed && (
                <>
                  <SideBarAccountName />
                  <div className="text-gray-8 dark:text-gray-8 border-t border-gray-9 dark:border-gray-18 mt-10 font-montserrat text-xs font-semibold px-4 pt-6">
                    CHAIN
                  </div>
                  <div className="mt-2 text-gray-18 dark:text-gray-4 flex flex-col px-2">
                    <div className="py-3 px-2 text-l italic text-gray-19 dark:text-gray-6 flex flex-row items-center font-semibold transition duration-150 ease-in-out">
                      <span className="px-2">
                        <LinkIcon className="h-5 w-5 stroke-3" aria-hidden="true" />
                      </span>
                      {activeChain?.name}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Main Content Section */}
            <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-56'}`}>
              <div className="flex items-center justify-end px-4 py-4">
                <div>
                  <ThemeToggle />
                </div>
                <div className="px-5">
                  <SupportedChains />
                </div>
                <ConnectButton />
              </div>

              {children}
            </div>
          </div>
        )}
      </Disclosure>
    </div>
  )
}

export default Navbar
