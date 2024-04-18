import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { FC, useState } from 'react'

interface ChainDropdownProps {
  chainOptions: Array<{ name: string; icon: string }>
}

const ChainDropdown: FC<ChainDropdownProps> = ({ chainOptions }) => {
  const [selectedChain, setSelectedChain] = useState(chainOptions[0])

  return (
    <Listbox value={selectedChain} onChange={setSelectedChain}>
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-opacity-20 py-2 pl-3 pr-10 text-left border border-gray-9 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="flex items-center">
              <Image
                src={selectedChain.icon}
                alt=""
                width="0"
                height="0"
                style={{ width: '2em', height: 'auto' }}
                className="flex-shrink-0 h-6 w-6 rounded-full"
              />
              <span className="ml-3 block truncate">{selectedChain.name}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 " aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white border-gray-9 bg-opacity-80 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {chainOptions.map((chain) => (
              <Listbox.Option
                key={chain.name}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? ' text-black dark:text-gray-1' : 'text-black dark:text-gray-1'
                  }`
                }
                value={chain}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {chain.name}
                    </span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Image
                        src={chain.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="flex-shrink-0 h-6 w-6 rounded-full"
                      />
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  )
}

export default ChainDropdown
