'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import React, { FC, useState } from 'react'
import { ConnectButton } from '@/components/web3/ConnectButton'

type NavbarProps = {
  navigation: Array<{name: string, href: string, icon: React.ReactElement, current: boolean}>;
  children?: React.ReactNode;
};

const Navbar: FC<NavbarProps> = ( {navigation, children} ) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
  <>
      <div className="min-h-full ">
      <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <div className="flex">
            {/* Sidebar Section */}
            <div className={`fixed top-0 left-0 h-screen z-10 transition-width duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
              <div className="flex-shrink-0 flex items-center justify-between space-x-5 border-b border-gray-9  pl-6 pr-2 py-6 mt-2">
                {!isCollapsed && (
                  <>
                <Link href="/" className="font-bold" legacyBehavior>
                  <Image
                    src="/assets/Images/Logos/lastic-logo.png"
                    width={130}
                    height={50}
                    alt="lastic Logo"
                  />
                </Link>
                  <ChevronLeftIcon 
                  className="h-4 w-5 hover:text-gray-12 cursor-pointer"
                  aria-hidden="true" 
                  onClick={toggleSidebar} 
                  />
                </>
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
              <div className='text-gray-8 font-montserrat text-xs font-semibold px-4 pt-6'>
                OVERVIEW
              </div>
              )}
              <div className="mt-2 text-gray-18 flex flex-col px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={` py-3 px-2 text-l flex flex-row items-center font-semibold transition duration-150 ease-in-out hover:text-teal-5 hover:bg-teal-1 hover:bg-opacity-60 hover:rounded-xl ${
                      item.current ? 'text-gray-600 bg-gray-200' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-current={item.current ? 'page' : undefined}
                    >
                    <ChevronRightIcon className="h-4 w-5" aria-hidden="true" />
                    <span className="px-2">
                      {Icon}
                    </span>

                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  )}
                )}
              </div>
              {!isCollapsed && (
              <div className='text-gray-8 border-t border-gray-9 mt-20 font-montserrat text-xs font-semibold px-4 pt-6'>
                ACCOUNT
              </div>
              )}
            </div>

            {/* Main Content Section */}
            <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-56'}`}>
              <div className="flex items-center justify-end px-4 py-4">
                <div className="px-7">
                  Network: polkadot 
                </div>
                <ConnectButton />
              </div>

              {children}
            </div>
          </div>
        </>
      )}
    </Disclosure>
      </div>

      

  </>
)};

export default Navbar;