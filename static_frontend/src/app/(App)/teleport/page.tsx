'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable } from '@polkadot/extension-dapp';
import * as paraspell from '@paraspell/sdk';
import Border from '@/components/border/Border';
import ChainDropdown from '@/components/dropdown/ChainDropDown';

const Teleport = () => {
  const [fromChain, setFromChain] = useState('Kusama');
  const [toChain, setToChain] = useState('Basilisk');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Implement other state variables and logic here

  const sendXCM = async () => {
    setIsLoading(true);
    // XCM transfer logic using paraspell goes here
    // Example:
    // const api = await ApiPromise.create({ provider: new WsProvider('wss://kusama-rpc.polkadot.io') });
    // const result = await paraspell.xcmPallet.transferRelayToPara(api, /* parameters */);
    // Handle result
    setIsLoading(false);
  };

  const chainOptions = [
    { name: 'Kusama', icon: '/assets/Images/NetworkIcons/assethub.svg' },
    { name: 'Kusama AssetHub', icon: '/assets/Images/NetworkIcons/assethub.svg' },
    { name: 'Polkadot', icon: '/assets/Images/NetworkIcons/assethub.svg' },
    { name: 'Polkadot AssetHub', icon: '/assets/Images/NetworkIcons/assethub.svg' },
  ];

  // JSX layout
  return (
    <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
    <Border >
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 font-syncopate">Teleport</h1>
      <p className="mb-6">Teleport assets between networks in the Polkadot and Kusama Ecosystem.</p>
      <p className="mb-2 font-semibold">Click here to learn how it works</p>
      <hr className="my-4 border-gray-9" />

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="mb-2">Source chain</p>
          <ChainDropdown chainOptions={chainOptions} />
        </div>
        <div>
          <p className="mb-2">Destination</p>
          <ChainDropdown chainOptions={chainOptions}/>
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
          <span>Balance: 0.0000DOT</span>
          <button className="text-blue-500">Max</button>
        </div>
      </div>

      <button className="w-full py-2 border border-gray-9 rounded-lg hover:bg-gray-1">
        Proceed To Confirmation
      </button>

      <p className="mt-6">
        You will receive {amount || 0} DOT on Polkadot to 1ct4C4...GgnR5r (You Are Owner)
      </p>
    </div>
    </Border>
    </section>
  );
};


export default Teleport;
