'use client'

import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import PrimaryButton from '@/components/button/SecondaryButton'
import { joinClassNames } from '@/utils/helperFunc' // This is a custom function to join class names
import { FC } from 'react'
import { ConnectButton } from '@/components/web3/ConnectButton'

type NavbarProps = {
  navigation: Array<{name: string, href: string, current: boolean}>;
};

const Navbar: FC<NavbarProps> = ( {navigation} ) => (
  <>
      <div className="min-h-full border-b border-gray-9">
        <Disclosure as="nav" className="">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
                <div className="flex py-3 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link
                        href="/"
                        className="font-bold"
                        legacyBehavior
                      >
                      <Image
                        src="/assets/Images/Logos/lastic-logo.png"
                        width={130}
                        height={50}
                        alt="lastic Logo"
                      />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={joinClassNames(
                              item.current
                                ? ' text-lastic-aqua'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-4 py-2 text-l font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                            legacyBehavior>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <ConnectButton />
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring- focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={joinClassNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                      legacyBehavior>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>

              <div className="flex justify-end space-y-1 px-2 md:hidden">
                <ConnectButton />
              </div>

            </>
          )}
        </Disclosure>


      </div>
  </>
);

export default Navbar;