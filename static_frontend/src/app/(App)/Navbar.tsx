'use client'

import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import SecondaryButton from '@/components/button/SecondaryButton'
import { joinClassNames } from '@/utils/helperFunc' // This is a custom function to join class names
import { FC } from 'react'
import { ConnectButton } from '@/components/web3/ConnectButton'

type NavbarProps = {
  navigation: Array<{name: string, href: string, current: boolean}>;
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
            <div className="w-64 h-screen border-r bg-[#F6FDFF] bg-opacity-40 border-gray-4 shadow-lg">
              <div className="flex-shrink-0 flex items-center justify-center p-4 border-b">
                <Link href="/" className="font-bold" legacyBehavior>
                  <Image
                    src="/assets/Images/Logos/lastic-logo.png"
                    width={130}
                    height={50}
                    alt="lastic Logo"
                  />
                </Link>
              </div>
              <div className="mt-5 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2 text-l font-medium transition duration-150 ease-in-out ${
                      item.current ? 'text-lastic-aqua bg-gray-200' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-current={item.current ? 'page' : undefined}
                    legacyBehavior>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Content Section */}
            <div className="flex-1">
              <ConnectButton />

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