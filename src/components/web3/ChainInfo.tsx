import { useInkathon } from '@poppyseed/lastic-sdk'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'

export const ChainInfo: FC = () => {
  const { api, activeChain } = useInkathon()
  const [chainInfo, setChainInfo] = useState<{ [_: string]: any }>()

  // Fetch Chain Info
  const fetchChainInfo = async () => {
    if (!api) {
      setChainInfo(undefined)
      return
    }

    const chain = (await api.rpc.system.chain())?.toString() || ''
    const version = (await api.rpc.system.version())?.toString() || ''
    const properties = ((await api.rpc.system.properties())?.toHuman() as any) || {}
    const tokenSymbol = properties?.tokenSymbol?.[0] || 'UNIT'
    const tokenDecimals = properties?.tokenDecimals?.[0] || 12
    const chainInfo = {
      Chain: chain,
      Version: version,
      Token: `${tokenSymbol} (${tokenDecimals} Decimals)`,
    }
    setChainInfo(chainInfo)
  }
  useEffect(() => {
    fetchChainInfo()
  }, [api])

  // Connection Loading Indicator
  if (!api)
    return (
      <div className="mt-8 mb-4 flex flex-col items-center justify-center space-y-3 text-center font-mono text-sm text-gray-400 sm:(flex-row space-x-3 space-y-0)">
        <div>
          Connecting to {activeChain?.name} ({activeChain?.rpcUrls?.[0]})
        </div>
      </div>
    ) 

  return (
    <>
      <div className="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 className="text-center font-mono text-gray-400">Chain Info</h2>

        <div 
        className='p-4 bg-white'>
          {/* Metadata */}
          {Object.entries(chainInfo || {}).map(([key, value]) => (
            <div key={key} className="text-sm leading-7">
              {key}:
              <strong className="float-right ml-6 truncate max-w-[15rem]" title={value}>
                {value}
              </strong>
            </div>
          ))}

          <div className="mt-3 flex items-center justify-center space-x-3">
            {/* Explorer Link */}
            {!!activeChain?.explorerUrls && !!Object.keys(activeChain.explorerUrls)?.length && (
              <Link
                href={Object.values(activeChain.explorerUrls)[0]}
                target="_blank"
                className="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
              >
                Explorer <HiOutlineExternalLink />
              </Link>
            )}
            {/* Faucet Link */}
            {!!activeChain?.faucetUrls?.length && (
              <Link
                href={activeChain.faucetUrls[0]}
                target="_blank"
                className="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
              >
                Faucet <HiOutlineExternalLink />
              </Link>
            )}
            {/* Contracts UI Link */}
            {!!activeChain?.rpcUrls?.length && (
              <Link
                href={`https://contracts-ui.substrate.io/?rpc=${activeChain.rpcUrls[0]}`}
                target="_blank"
                className="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
              >
                Contracts UI <HiOutlineExternalLink />
              </Link>
            )}
          </div>
        </div>

        {/* Mainnet Security Disclaimer */}
        {!activeChain?.testnet && (
          <>
            <h2 className="text-center font-mono text-red-400">Security Disclaimer</h2>

            <div className='bg-red-500 bg-red-300 text-sm'>
              You are interacting with un-audited mainnet contracts and risk all your funds. Never
              transfer tokens to this contract.
            </div>
          </>
        )}
      </div>
    </>
  )
}
