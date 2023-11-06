// Dependencies
import PrimaryButton from '@/components/button/PrimaryButton';
import Image from 'next/image';
import React from 'react';

const DeeperDive: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center border-b border-gray-9 py-20 bg-white bg-opacity-70 p-4 sm:p-12">
            <section className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
                <div className='py-5'>
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-syncopate font-bold text-center mb-4">Why polkadot?</h1>

                    {/* Subtitle */}
                    <h2 className="text-lg sm:text-xl font-syncopate text-center mb-2">A deeper dive</h2>

                </div>

                {/* Image and Info Container */}
                <div className='grid grid-cols-1  md:grid-cols-2  gap-4  sm:flex-row w-full sm:items-center'>

                    {/* Image */}
                    <div className="relative h-72 md:h-96 xl:h-[600px] w-full">
                        <Image 
                            src="/assets/Images/coretime-vis.png"
                            alt="Deeper Dive Image"
                            className="rounded-2xl border border-gray-9 object-cover" 
                            fill
                        />
                    </div>

                    {/* Info */}
                    <div className=' flex flex-col justify-center p-2 sm:p-10'>
                        <div className="text-sm md:text-base text-left space-y-4 py-5">
                        <p><span className="font-bold text-base sm:text-lg">Innovation at the Heart of Blockspace Transactions. </span>
                        Blockspace is more than just storage; it&apos;s an essential resource. Other so-called blockspace marketplaces only allow for the re-ordering of transactions or speculation of staking yields. Lastic can do much, much, more.</p>
                        </div>

                        {/* List */}
                        <ul className="list-disc p-4 sm:p-10 text-left">
                            <li className='py-3'><span className='font-bold'>Do what you want with your blockspace: </span> Go beyond parachains and utilize your blockspace however you want.</li>
                            <li className='py-3'><span className='font-bold'>Tradable blockspace: </span> With coretime on Polkadot, access to blockspace is represented as NFTs, making it easy to trade.</li>
                            <li className='py-3'><span className='font-bold'>No more auctions: </span> Coretime sales on Polkadot replace the costly and unpredictable slot auctions</li>
                        </ul>

                        {/* Button */}
                        <div className='px-4 mx-auto sm:px-20 py-5'>
                            <PrimaryButton title="Read the Docs" location="https://docs.lastic.xyz/" /> 
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DeeperDive;