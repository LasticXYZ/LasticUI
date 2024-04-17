import { SUPPORTED_CHAINS } from '@/config/environment'
import { switchChainInPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const SupportedChains: FC = () => {
  const { activeChain } = useInkathon()
  //const { activeChain, switchActiveChain } = useInkathon()
  const pathname = usePathname()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  //const handleChainSwitch = async (chain: SubstrateChain, relayChain: SubstrateChain) => {
  // if (chain.network !== activeChain?.network) {
  //   await switchActiveChain?.(chain, relayChain)
  //   toast.success(`Switched to ${chain.name}`)
  //   setIsDropdownOpen(false) // Close dropdown after switching
  // }
  //}

  return (
    <div className="relative flex flex-row">
      <div
        className="flex flex-row justify-between space-x-3 items-center p-2 cursor-pointer"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <p>Network: {activeChain?.name}</p>
        <FiChevronDown size={16} className={`${isDropdownOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full border-t-2 border-gray-3">
          {SUPPORTED_CHAINS.map((chainPair, index) => {
            const { coretime, relay } = chainPair
            return (
              coretime !== activeChain?.network && (
                <Link
                  key={index}
                  //onClick={() => handleChainSwitch(coretime, relay)}
                  href={switchChainInPath(pathname, relay)}
                  className="p-2 flex justify-between items-center cursor-pointer"
                >
                  <p>{coretime}</p>
                </Link>
              )
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SupportedChains
