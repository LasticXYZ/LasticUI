'use client'

import { Disclosure } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import SecondaryButton from '@/components/button/SecondaryButton'
import { joinClassNames } from '@/utils/helperFunc' // This is a custom function to join class names
import { FC } from 'react'
import { ConnectButton } from '@/components/web3/ConnectButton'

type NavbarProps = {
  navigation: Array<{name: string, href: string, icon: React.ReactElement, current: boolean}>;
  children?: React.ReactNode;
};

const Navbar: FC<NavbarProps> = ( {navigation, children} ) => (
  <>
      <div className="min-h-full ">
      <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <div className="flex">
            {/* Sidebar Section */}
            <div className="fixed top-0 left-0 w-64 h-screen z-10">
              <div className="flex-shrink-0 flex items-left border-b border-gray-9 justify-start p-6 mt-5">
                <Link href="/" className="font-bold" legacyBehavior>
                  <Image
                    src="/assets/Images/Logos/lastic-logo.png"
                    width={160}
                    height={50}
                    alt="lastic Logo"
                  />
                </Link>
              </div>
              <div className='text-gray-8 font-montserrat text-xs font-semibold px-4 pt-6'>
                OVERVIEW
              </div>
              <div className="mt-2 text-gray-18 flex flex-col px-5">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2 py-3 text-l flex flex-row font-semibold transition duration-150 ease-in-out hover:text-teal-4 ${
                      item.current ? 'text-gray-600 bg-gray-200' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-current={item.current ? 'page' : undefined}
                    >
                    <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="px-2">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    {item.name}
                  </Link>
                  )}
                )}
              </div>
            </div>

            {/* Main Content Section */}
            <div className="flex-1 ml-64">
              <div className="flex items-center justify-end px-4 py-4">
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
);

export default Navbar;