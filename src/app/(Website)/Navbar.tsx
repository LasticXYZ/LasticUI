'use client'

import PrimaryButton from '@/components/button/PrimaryButton'
import PrimaryButtonWeb from '@/components/button/PrimaryButtonWeb'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

type NavbarProps = {
  navigation: Array<{ name: string; href: string; current: boolean }>
}

const Navbar: FC<NavbarProps> = ({ navigation }) => {
  const pathname = usePathname()

  return (
    <>
      <div className="w-full fixed z-50 bg-[#020710] pb-4 border-b font-dm_sans border-gray-16 bg-opacity-70">
        <Disclosure as="nav" className="">
          {({ open }) => (
            <>
              <div className="mx-auto 2xl:px-40 px-4 sm:px-6 lg:px-8">
                <div className="flex mt-5 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 cursor-pointer">
                      <Link href="/" className="font-bold" legacyBehavior>
                        <Image
                          src="/assets/Images/Logos/lastic-logo-dark.png"
                          width={130}
                          height="0"
                          style={{ width: '10em', height: 'auto' }}
                          quality={100}
                          alt="Lastic Logo"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className={`${pathname === item.href ? 'text-pink-4' : 'text-white hover:text-pink-4'}`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        <PrimaryButtonWeb title="Launch" location="/start" />
                      </div>
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
                <div className="space-y-3 my-5 flex flex-col justify-center text-center px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${pathname === item.href ? 'text-pink-4' : 'text-white hover:text-pink-4'}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex justify-center space-y-1 px-2 md:hidden">
                  <PrimaryButton title="Launch" location="/start" />
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}

export default Navbar
