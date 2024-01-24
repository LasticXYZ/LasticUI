'use client'

import Border from '@/components/border/Border'
import ChainDropdown from '@/components/dropdown/ChainDropDown'
import SupportedChains from '@/components/web3/SupportedChains'
import { Builder } from '@paraspell/sdk'
import { allSubstrateChains, useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import Link from 'next/link'
import { useState } from 'react'

const Teleport = () => {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { api, relayApi, activeAccount, activeSigner } = useInkathon()

  const { balanceFormatted } = useBalance(activeAccount?.address, true, {
    forceUnit: false,
    fixedDecimals: 2,
    removeTrailingZeros: true,
  })

  // Implement other state variables and logic here

  const sendXCM = async () => {
    setIsLoading(true)
    // XCM transfer logic using paraspell goes here
    // Example:
    // const api = await ApiPromise.create({ provider: new WsProvider('wss://kusama-rpc.polkadot.io') });
    // const result = await paraspell.xcmPallet.transferRelayToPara(api, /* parameters */);
    // Handle result
    setIsLoading(false)
  }

  const chainOptions = [
    { name: 'Kusama', icon: '/assets/Images/NetworkIcons/assethub.svg' },
    { name: 'Kusama AssetHub', icon: '/assets/Images/NetworkIcons/assethub.svg' },
    { name: 'Polkadot', icon: '/assets/Images/NetworkIcons/assethub.svg' },
    { name: 'Polkadot AssetHub', icon: '/assets/Images/NetworkIcons/assethub.svg' },
  ]

  const transactionHandler = {
    onBroadcast: (hash: string) => {
      console.log(`Transaction broadcasted with hash ${hash}`)
    },
    onFinalized: (hash: string) => {
      console.log(`Transaction finalized with hash ${hash}`)
    },
    onReady: (hash: string) => {
      console.log(`Transaction ready with hash ${hash}`)
    },
    onInBlock: (hash: string) => {
      console.log(`Transaction in block with hash ${hash}`)
    },
  }

  const functionSendXCM = async (amount: number) => {
    const amountVal: number = amount * 10 ** 5
    if (!activeAccount || !relayApi || !api) return

    let test = await Builder(api) //Api parameter is optional
      .to('AssetHubKusama') // Destination Parachain //You can now add custom ParachainID eg. .to('Basilisk', 2024)
      .amount(amountVal) // Token amount
      .address(activeAccount.address) // AccountId32 or AccountKey20 address
      .build() // Function called to build call

    console.log(test)
  }

  // JSX layout
  return (
    <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 font-syncopate">Teleport</h1>
          <p className="mb-6">
            Teleport assets between networks in the Polkadot and Kusama Ecosystem.
          </p>
          <Link href="/" className="mb-2 font-semibold">
            Click here to learn how it works
          </Link>
          <hr className="my-4 border-gray-9" />

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="mb-2">Source chain</p>
              <ChainDropdown chainOptions={chainOptions} />
              <SupportedChains />
            </div>
            <div>
              <p className="mb-2">Destination</p>
              <ChainDropdown chainOptions={chainOptions} />
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2">Asset Amount</p>
            <div className="flex items-center p">
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 p-2 bg-transparent border border-gray-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-7 focus:border-transparent"
              />
              <span className="ml-2">DOT</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Balance: {balanceFormatted}</span>
              <button className="text-blue-500">Max</button>
            </div>
          </div>

          <button
            onClick={() => functionSendXCM(1)}
            className="w-full py-2 border border-gray-9 rounded-lg hover:bg-gray-1"
          >
            Proceed To Confirmation
          </button>

          <div>
            {allSubstrateChains.map((chain) => (
              <option key={chain.network} value={chain.network}>
                {chain.name}
              </option>
            ))}
          </div>

          <p className="mt-6">
            You will receive {amount || 0} DOT on Polkadot to 1ct4C4...GgnR5r (You Are Owner)
          </p>
        </div>
      </Border>
    </section>
  )
}

export default Teleport
