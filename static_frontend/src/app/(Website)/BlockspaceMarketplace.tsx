import Image from 'next/image';
import React from 'react';

const BlockspaceMarketplace = () => {
    return (
        <div className="bg-pink-1 border bg-opacity-70 border-gray-9">
        <section className="mx-auto max-w-9xl py-28 px-4 sm:px-6 lg:px-8">
            <h2 className="font-syncopate text-center font-bold pt-14 px-5 text-2xl md:text-1xl xl:text-2xl">
            A Blockspace Marketplace?
            </h2>

            <div className="grid grid-cols-2 items-center justify-between p-8">
                <div className="flex-2 pr-8">
                    <Image 
                    src="/assets/Images/bubble-gum.png" 
                    alt="Abstract Art" 
                    className="w-full" 
                    width={400}
                    height={400}
                    />
                </div>

                <div className="flex-3 pl-8">
                    <p className="my-4 text-bold text-gray-600">
                        Lastic is a user-friendly marketplace for buying and selling blockspace tailored to your needs, built on Polkadot Coretime.
                    </p>

                    <ul className='py-2 px-4'>
                        <li className="mb-2">
                        <strong className="font-semibold">1. Buy or Sell Blockspace:</strong> 
                            One place for your blockspace.
                        </li>
                        <li className="mb-2">
                            <strong className="font-semibold">2. Use your blockspace: </strong>
                            Connect your Polkadot parachain, Wasm smart contract, ZK Prover, or any other computation.
                        </li>
                        <li className="mb-2">
                            <strong className="font-semibold">3. Automation and renewals:</strong> 
                            Allow parachains to automate their coretime allocation based on current market conditions.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        </div>
    );
};

export default BlockspaceMarketplace;
