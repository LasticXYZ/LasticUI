import { env } from '@/config/environment'
import {
  SubstrateChain,
  SubstrateWalletPlatform,
  allSubstrateWallets,
  getSubstrateChain,
  isWalletInstalled,
  useBalance,
  useInkathon,
  SubstrateWallet
} from '@scio-labs/use-inkathon'
import { FC, useState } from 'react'
import { toast } from 'react-hot-toast'
import { AiOutlineCheckCircle, AiOutlineDisconnect } from 'react-icons/ai'
import { FiChevronDown, FiExternalLink } from 'react-icons/fi'

const SupportedChains: FC = () => {
  const {
    activeChain,
    switchActiveChain,
  } = useInkathon();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [supportedChains] = useState(
    env.supportedChains.map((networkId) => getSubstrateChain(networkId) as SubstrateChain),
  );

  const handleChainSwitch = async (chain: SubstrateChain) => {
    if (chain.network !== activeChain?.network) {
      await switchActiveChain?.(chain);
      toast.success(`Switched to ${chain.name}`);
      setIsDropdownOpen(false); // Close dropdown after switching
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-19">
      <div
        className="flex justify-between items-center p-2 cursor-pointer"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <p>{activeChain?.name}</p>
        <FiChevronDown size={16} className={`${isDropdownOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full border-t-2 border-gray-3">
          {supportedChains.map((chain) => (
            chain.network !== activeChain?.network && (
              <div
                key={chain.network}
                onClick={() => handleChainSwitch(chain)}
                className="p-2 flex justify-between items-center hover:bg-gray-1 cursor-pointer"
              >
                <p>{chain.name}</p>
              </div>
            )
          ))}
        </div>
      )}

      {/* Current Chain Indicator */}
      <div className="flex justify-end p-2">
        {activeChain && <AiOutlineCheckCircle size={16} className="text-green-500" />}
      </div>
    </div>
  );
};

export default SupportedChains;
