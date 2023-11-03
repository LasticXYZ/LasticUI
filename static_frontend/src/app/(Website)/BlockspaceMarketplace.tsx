import Image from 'next/image';
import React from 'react';

const BlockspaceMarketplace = () => {
    return (
        <div className="bg-pink-1 pt-10 border-y bg-opacity-70 border-gray-9">
            <section className="mx-auto max-w-9xl py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="font-syncopate text-center font-bold pt-2 sm:pt-14 px-5 text-xl sm:text-xl md:text-2xl">
                    A Blockspace Marketplace?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-4 py-12">
                    <div className="md:flex-1">
                        <div className="relative h-72 md:h-96 xl:h-[500px] w-full">
                            <Image 
                                src="/assets/Images/deeper_dive.png" 
                                alt="Abstract Art" 
                                className="rounded-2xl border border-gray-9 object-cover" 
                                layout="fill"
                            />
                        </div>
                    </div>

                    <div className="text-sm px-4 md:text-base md:flex-1">
                        <p className="my-4 text-base py-4 sm:text-lg font-bold text-gray-600">
                            Lastic is a user-friendly marketplace for buying and selling blockspace tailored to your needs, built on Polkadot Coretime.
                        </p>

                        <ul className='list-disc pl-5 sm:pl-8'>
                            <li className="py-3">
                                <strong className="font-semibold">Buy or Sell Blockspace: </strong> 
                                One place for your blockspace.
                            </li>
                            <li className="py-3">
                                <strong className="font-semibold">Use your blockspace: </strong>
                                Connect your Polkadot parachain, Wasm smart contract, ZK Prover, or any other computation.
                            </li>
                            <li className="py-3">
                                <strong className="font-semibold">Automation and renewals: </strong> 
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
