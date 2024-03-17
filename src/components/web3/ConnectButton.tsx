import { WalletModal } from '@/components/modal/WalletModal'
import { truncateHash } from '@/utils/truncateHash'
import { useIsSSR } from '@/utils/useIsSSR'
import { encodeAddress } from '@polkadot/util-crypto'
import {
  SubstrateWallet,
  SubstrateWalletPlatform,
  isWalletInstalled,
  nova,
  polkadotjs,
  subwallet,
  talisman,
  useBalance,
  useInkathon,
} from '@poppyseed/lastic-sdk'
import Link from 'next/link'
import { FC, useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineDisconnect } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import { AccountName } from './AccountName' // Assuming AccountName is in the same directory

export const allWallets: SubstrateWallet[] = [talisman, polkadotjs, subwallet, nova]

export interface ConnectButtonProps {}
export const ConnectButton: FC<ConnectButtonProps> = () => {
  const { activeChain, connect, disconnect, activeAccount, accounts, setActiveAccount } =
    useInkathon()
  const { balanceFormatted } = useBalance(activeAccount?.address, true, {
    forceUnit: false,
    fixedDecimals: 2,
    removeTrailingZeros: true,
  })
  const [browserWallets] = useState(
    allWallets.filter((w) => w.platforms.includes(SubstrateWalletPlatform.Browser)),
  )
  const isSSR = useIsSSR()
  const [openConnect, setOpenConnect] = useState(false)
  const [openChooseAccount, setOpenChooseAccount] = useState(false)
  const [chosenWallet, setChosenWallet] = useState<SubstrateWallet | null>(null)

  return (
    <>
      {!activeAccount && (
        // Connect Button + Modal
        <div className="relative">
          <button
            className=" font-unbounded uppercase font-black rounded-2xl hover:bg-pink-3 border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
            onClick={() => setOpenConnect(!openConnect)}
          >
            <span>Connect Wallet</span>
          </button>

          <WalletModal isOpen={openConnect} onClose={() => setOpenConnect(false)}>
            <ul className="rounded-2xl border border-gray-9 bg-white divide-y divide-gray-2">
              {/* Installed Wallets */}
              {!isSSR &&
                !activeAccount &&
                browserWallets.map((w) =>
                  isWalletInstalled(w) ? (
                    <li
                      key={w.id}
                      onClick={() => {
                        // If the wallet has only one account, connect directly.
                        console.log('w:', w)
                        connect?.(undefined, undefined, w)
                        setChosenWallet(w)
                      }}
                      className="p-3 flex flex-row cursor-pointer hover:bg-gray-1 transition duration-300"
                    >
                      <img
                        src={w.logoUrls[0]}
                        alt={w.name}
                        className="w-6 h-6 mr-2 inline-block"
                      ></img>
                      {w.name}
                    </li>
                  ) : (
                    <li key={w.id} className="p-3">
                      <Link
                        href={w.urls.website}
                        className="flex items-center justify-between opacity-50 hover:opacity-70 hover:no-underline transition duration-300"
                      >
                        <div>
                          <span>{w.name}</span>
                          <p className="text-xs mt-1">Not installed</p>
                        </div>
                        <FiExternalLink size={16} />
                      </Link>
                    </li>
                  ),
                )}
            </ul>
          </WalletModal>
        </div>
      )}
      {!!activeAccount && (
        // Account Menu & Disconnect Button
        <div className="">
          <div className="flex items-center space-x-4">
            {/* Account Name, Address, and AZNS-Domain (if assigned) */}
            <button
              className=" font-unbounded uppercase font-black rounded-2xl hover:bg-pink-3 border border-gray-9 text-xs inline-flex items-center justify-center px-7 py-2 mr-3 text-center text-black focus:ring-4"
              onClick={() => setOpenChooseAccount(true)}
            >
              <div className=" px-6">
                <AccountName account={activeAccount} />
                <p className="text-xs font-mono font-thin opafcity-75">
                  {truncateHash(
                    encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42),
                    8,
                  )}
                </p>
              </div>
            </button>
          </div>

          {/* Available Accounts/Wallets */}
          <WalletModal isOpen={openChooseAccount} onClose={() => setOpenChooseAccount(false)}>
            <>
              {chosenWallet &&
                (accounts || []).map((acc) => {
                  const encodedAddress = encodeAddress(acc.address, activeChain?.ss58Prefix || 42)
                  const truncatedEncodedAddress = truncateHash(encodedAddress, 10)
                  return (
                    <div
                      key={encodedAddress}
                      // When an account is clicked, set it as active and then connect to the chosen wallet.
                      onClick={() => {
                        setActiveAccount?.(acc)
                        connect?.(undefined, undefined, chosenWallet)
                        if (acc.address !== activeAccount.address) {
                          setActiveAccount?.(acc)
                        }
                      }}
                      className={`p-3 flex justify-between items-center cursor-pointer ${acc.address === activeAccount.address ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-2'}`}
                    >
                      <div>
                        <AccountName account={acc} />
                        <p className="text-xs">{truncatedEncodedAddress}</p>
                      </div>
                      {acc.address === activeAccount.address && (
                        <AiOutlineCheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                  )
                })}

              {/* Account Balance */}
              {balanceFormatted !== undefined && (
                <div className="rounded-2x px-4 py-2 font-bold text-gray-19 hover:bg-gray-9">
                  {balanceFormatted}
                </div>
              )}
              <div
                className="p-2 flex justify-between items-center cursor-pointer hover:bg-red-1"
                onClick={() => disconnect?.()}
              >
                <span className="text-red-5">Disconnect</span>
                <AiOutlineDisconnect size={18} className="text-red-5" />
              </div>
            </>
          </WalletModal>
        </div>
      )}
    </>
  )
}
